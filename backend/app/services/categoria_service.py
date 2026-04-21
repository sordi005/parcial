from fastapi import HTTPException, status
from app.uow import UnitOfWork
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaRead, CategoriaListResponse


class CategoriaService:
    """Orquesta la lógica de negocio de categorías usando UnitOfWork. Sin SQL directo, sin commit."""

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_all(self, skip: int = 0, limit: int = 100) -> CategoriaListResponse:
        with self.uow as uow:
            items = uow.categorias.get_all(skip=skip, limit=limit)
            total = uow.categorias.count()
            # Convertir a schema DENTRO del with, mientras la sesión está abierta
            return CategoriaListResponse(
                total=total,
                items=[CategoriaRead.model_validate(c) for c in items]
            )

    def get_by_id(self, categoria_id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada"
                )
            return CategoriaRead.model_validate(categoria)

    def create(self, categoria_data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            existing = uow.categorias.get_by_nombre(categoria_data.nombre)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Categoría ya existe"
                )
            categoria = uow.categorias.create(categoria_data)
            uow.session.flush()  # obtener el id asignado por la BD antes del commit
            return CategoriaRead.model_validate(categoria)
            # Al salir del with → commit automático

    def update(self, categoria_id: int, categoria_data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada"
                )
            existing = uow.categorias.get_by_nombre_excluding(categoria_data.nombre, categoria_id)
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe otra categoría con ese nombre"
                )
            categoria = uow.categorias.update(categoria, categoria_data)
            return CategoriaRead.model_validate(categoria)

    def delete(self, categoria_id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(categoria_id)
            if not categoria:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Categoría no encontrada"
                )
            if uow.categorias.has_productos(categoria_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="No se puede eliminar la categoría porque tiene productos relacionados"
                )
            uow.categorias.delete(categoria)

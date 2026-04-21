from typing import List, Optional
from sqlmodel import Session, select
from app.models.categoria import Categoria
from app.models.producto import ProductoCategoria
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate


class CategoriaRepository:
    """Encapsula el acceso a datos de categorías. No hace commit."""

    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Categoria]:
        statement = select(Categoria).offset(skip).limit(limit)
        return self.session.exec(statement).all()

    def count(self) -> int:
        return len(self.session.exec(select(Categoria)).all())

    def get_by_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, categoria_id)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        return self.session.exec(
            select(Categoria).where(Categoria.nombre == nombre)
        ).first()

    def get_by_nombre_excluding(self, nombre: str, exclude_id: int) -> Optional[Categoria]:
        return self.session.exec(
            select(Categoria).where(
                Categoria.nombre == nombre,
                Categoria.id != exclude_id
            )
        ).first()

    def create(self, categoria_data: CategoriaCreate) -> Categoria:
        categoria = Categoria.model_validate(categoria_data)
        self.session.add(categoria)
        return categoria

    def update(self, categoria: Categoria, categoria_data: CategoriaUpdate) -> Categoria:
        categoria.nombre = categoria_data.nombre
        categoria.descripcion = categoria_data.descripcion
        self.session.add(categoria)
        return categoria

    def delete(self, categoria: Categoria) -> None:
        self.session.delete(categoria)

    def has_productos(self, categoria_id: int) -> bool:
        result = self.session.exec(
            select(ProductoCategoria).where(
                ProductoCategoria.categoria_id == categoria_id
            )
        ).first()
        return result is not None

from typing import Optional, List
from fastapi import HTTPException, status
from app.uow import UnitOfWork
from app.schemas.producto import ProductoCreate, ProductoUpdate, ProductoRead


class ProductoService:
    """Orquesta la lógica de negocio de productos usando UnitOfWork. Sin SQL directo, sin commit."""

    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_all(self, skip: int = 0, limit: int = 100, categoria_id: Optional[int] = None) -> List[ProductoRead]:
        with self.uow as uow:
            productos = uow.productos.get_all(skip=skip, limit=limit, categoria_id=categoria_id)
            # build_producto_read ya devuelve un schema (ProductoRead), no un modelo
            items = [uow.productos.build_producto_read(p) for p in productos]
            return items

    def get_by_id(self, producto_id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado"
                )
            return uow.productos.build_producto_read(producto)

    def create(self, producto_data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            # Validar duplicado
            if uow.productos.get_by_nombre(producto_data.nombre):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Producto ya existe"
                )

            # Validar que todas las categorías existan
            for cat_id in producto_data.categoria_ids:
                if not uow.productos.get_categoria_by_id(cat_id):
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Categoría con ID {cat_id} no encontrada"
                    )

            # Validar que todos los ingredientes existan
            for ing_data in producto_data.ingredientes:
                if not uow.productos.get_ingrediente_by_id(ing_data.ingrediente_id):
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Ingrediente con ID {ing_data.ingrediente_id} no encontrado"
                    )

            # Crear producto y relaciones en una sola transacción
            producto = uow.productos.create(producto_data)
            uow.session.flush()  # obtener el id antes de crear relaciones
            uow.productos.assign_categorias(producto.id, producto_data.categoria_ids)
            uow.productos.assign_ingredientes(producto.id, producto_data.ingredientes)
            uow.session.flush()  # para que build_producto_read pueda leer las relaciones
            return uow.productos.build_producto_read(producto)

    def update(self, producto_id: int, producto_data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado"
                )

            if uow.productos.get_by_nombre_excluding(producto_data.nombre, producto_id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe otro producto con ese nombre"
                )

            for cat_id in producto_data.categoria_ids:
                if not uow.productos.get_categoria_by_id(cat_id):
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Categoría con ID {cat_id} no encontrada"
                    )
            for ing_data in producto_data.ingredientes:
                if not uow.productos.get_ingrediente_by_id(ing_data.ingrediente_id):
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Ingrediente con ID {ing_data.ingrediente_id} no encontrado"
                    )

            uow.productos.update(producto, producto_data)
            uow.productos.clear_categorias(producto_id)
            uow.productos.clear_ingredientes(producto_id)
            uow.session.flush()
            uow.productos.assign_categorias(producto_id, producto_data.categoria_ids)
            uow.productos.assign_ingredientes(producto_id, producto_data.ingredientes)
            uow.session.flush()
            return uow.productos.build_producto_read(producto)

    def delete(self, producto_id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_by_id(producto_id)
            if not producto:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Producto no encontrado"
                )
            uow.productos.clear_categorias(producto_id)
            uow.productos.clear_ingredientes(producto_id)
            uow.productos.delete(producto)

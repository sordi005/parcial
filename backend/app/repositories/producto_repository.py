from typing import List, Optional
from sqlmodel import Session, select
from app.models.producto import Producto
from app.models.categoria import Categoria, ProductoCategoria
from app.models.ingrediente import Ingrediente, ProductoIngrediente
from app.schemas.producto import ProductoUpdate, ProductoRead, ProductoIngredienteRead, ProductoIngredienteInput
from app.schemas.categoria import CategoriaRead


class ProductoRepository:
    """Encapsula el acceso a datos de productos. No hace commit."""

    def __init__(self, session: Session):
        self.session = session

    def get_all(self, skip: int = 0, limit: int = 100, categoria_id: Optional[int] = None) -> List[Producto]:
        query = select(Producto)
        if categoria_id:
            query = query.join(ProductoCategoria).where(
                ProductoCategoria.categoria_id == categoria_id
            )
        return self.session.exec(query.offset(skip).limit(limit)).all()

    def count(self, categoria_id: Optional[int] = None) -> int:
        query = select(Producto)
        if categoria_id:
            query = query.join(ProductoCategoria).where(
                ProductoCategoria.categoria_id == categoria_id
            )
        return len(self.session.exec(query).all())

    def get_by_id(self, producto_id: int) -> Optional[Producto]:
        return self.session.get(Producto, producto_id)

    def get_by_nombre(self, nombre: str) -> Optional[Producto]:
        return self.session.exec(
            select(Producto).where(Producto.nombre == nombre)
        ).first()

    def get_by_nombre_excluding(self, nombre: str, exclude_id: int) -> Optional[Producto]:
        return self.session.exec(
            select(Producto).where(
                Producto.nombre == nombre,
                Producto.id != exclude_id
            )
        ).first()

    def create(self, producto: Producto) -> Producto:
        self.session.add(producto)
        return producto

    def update(self, producto: Producto, producto_data: ProductoUpdate) -> Producto:
        producto.nombre = producto_data.nombre
        producto.descripcion = producto_data.descripcion
        producto.precio = producto_data.precio
        producto.disponible = producto_data.disponible
        self.session.add(producto)
        return producto

    def delete(self, producto: Producto) -> None:
        self.session.delete(producto)

    def add_categoria(self, producto_id: int, categoria_id: int) -> ProductoCategoria:
        link = ProductoCategoria(
            producto_id=producto_id,
            categoria_id=categoria_id,
        )
        self.session.add(link)
        self.session.flush()
        return link

    def add_ingrediente(self, producto_id: int, ingrediente_id: int, cantidad: float) -> ProductoIngrediente:
        link = ProductoIngrediente(
            producto_id=producto_id,
            ingrediente_id=ingrediente_id,
            cantidad=cantidad,
        )
        self.session.add(link)
        self.session.flush()
        return link

    def assign_categorias(self, producto_id: int, categoria_ids: List[int]) -> None:
        for cat_id in categoria_ids:
            relacion = ProductoCategoria(producto_id=producto_id, categoria_id=cat_id)
            self.session.add(relacion)

    def assign_ingredientes(self, producto_id: int, ingredientes_data: List[ProductoIngredienteInput]) -> None:
        for ing_data in ingredientes_data:
            relacion = ProductoIngrediente(
                producto_id=producto_id,
                ingrediente_id=ing_data.ingrediente_id,
                cantidad=ing_data.cantidad
            )
            self.session.add(relacion)

    def clear_categorias(self, producto_id: int) -> None:
        for rel in self.session.exec(
            select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
        ):
            self.session.delete(rel)

    def clear_ingredientes(self, producto_id: int) -> None:
        for rel in self.session.exec(
            select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        ):
            self.session.delete(rel)

    def get_categoria_by_id(self, categoria_id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, categoria_id)

    def get_ingrediente_by_id(self, ingrediente_id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, ingrediente_id)

    def build_producto_read(self, producto: Producto) -> ProductoRead:
        """Construye el schema ProductoRead con todas las relaciones."""
        categorias = self.session.exec(
            select(Categoria)
            .join(ProductoCategoria)
            .where(ProductoCategoria.producto_id == producto.id)
        ).all()

        ingredientes_raw = self.session.exec(
            select(Ingrediente, ProductoIngrediente.cantidad)
            .join(ProductoIngrediente)
            .where(ProductoIngrediente.producto_id == producto.id)
        ).all()

        ingredientes = [
            ProductoIngredienteRead(
                ingrediente_id=ing.id,
                nombre=ing.nombre,
                cantidad=cantidad,
                unidad_medida=ing.unidad_medida
            )
            for ing, cantidad in ingredientes_raw
        ]

        return ProductoRead(
            id=producto.id,
            nombre=producto.nombre,
            descripcion=producto.descripcion,
            precio=producto.precio,
            disponible=producto.disponible,
            created_at=producto.created_at,
            categorias=[CategoriaRead.model_validate(cat) for cat in categorias],
            ingredientes=ingredientes
        )

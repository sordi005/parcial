from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class ProductoCategoria(SQLModel, table=True):
    """Tabla intermedia para la relación N:N entre Producto y Categoría"""
    __tablename__ = "producto_categoria"
    
    producto_id: int = Field(foreign_key="producto.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categoria.id", primary_key=True)


class Categoria(SQLModel, table=True):
    """Modelo de Categoría de productos"""
    __tablename__ = "categoria"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=3, max_length=100, unique=True, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relación N:N con Producto
    productos: List["Producto"] = Relationship(
        back_populates="categorias",
        link_model=ProductoCategoria
    )

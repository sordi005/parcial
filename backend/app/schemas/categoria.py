from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field


class CategoriaBase(SQLModel):
    """Base schema para Categoría"""
    nombre: str = Field(min_length=3, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)


class CategoriaCreate(CategoriaBase):
    """Schema para crear una categoría"""
    pass


class CategoriaUpdate(CategoriaBase):
    """Schema para actualizar una categoría"""
    pass


class CategoriaRead(CategoriaBase):
    """Schema para leer una categoría"""
    id: int
    created_at: datetime


class CategoriaListResponse(SQLModel):
    """Respuesta paginada para categorías"""
    total: int
    items: List[CategoriaRead]

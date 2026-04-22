export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

export interface CategoriaUpdate {
  nombre: string;
  descripcion?: string;
}

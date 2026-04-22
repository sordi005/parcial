import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types';

// GET listado con filtro opcional
export const useProductos = (categoriaId?: number | null) => {
  return useQuery<Producto[]>({
    queryKey: ['productos', categoriaId ?? undefined],
    queryFn: async () => {
      const params = categoriaId ? { categoria_id: categoriaId } : {};
      const { data } = await apiClient.get<Producto[]>('/productos', { params });
      return data;
    },
  });
};

// GET por ID
export const useProducto = (id: number | undefined) => {
  return useQuery<Producto>({
    queryKey: ['productos', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Producto>(`/productos/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// POST crear
export const useCreateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProducto: ProductoCreate) => {
      const { data } = await apiClient.post<Producto>('/productos', newProducto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

// PUT actualizar
export const useUpdateProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProductoUpdate }) => {
      const response = await apiClient.put<Producto>(`/productos/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['productos', variables.id] });
    },
  });
};

// DELETE eliminar
export const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
};

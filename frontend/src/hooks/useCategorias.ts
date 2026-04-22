import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types';

// GET listado
export const useCategorias = () => {
  return useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: async () => {
      const { data } = await apiClient.get<Categoria[]>('/categorias');
      return data;
    },
  });
};

// GET por ID
export const useCategoria = (id: number | undefined) => {
  return useQuery<Categoria>({
    queryKey: ['categorias', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Categoria>(`/categorias/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// POST crear
export const useCreateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCategoria: CategoriaCreate) => {
      const { data } = await apiClient.post<Categoria>('/categorias', newCategoria);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

// PUT actualizar
export const useUpdateCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoriaUpdate }) => {
      const response = await apiClient.put<Categoria>(`/categorias/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      queryClient.invalidateQueries({ queryKey: ['categorias', variables.id] });
    },
  });
};

// DELETE eliminar
export const useDeleteCategoria = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/categorias/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
};

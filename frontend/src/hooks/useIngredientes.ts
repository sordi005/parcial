import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types';

// GET listado
export const useIngredientes = () => {
  return useQuery<Ingrediente[]>({
    queryKey: ['ingredientes'],
    queryFn: async () => {
      const { data } = await apiClient.get<Ingrediente[]>('/ingredientes');
      return data;
    },
  });
};

// GET por ID
export const useIngrediente = (id: number | undefined) => {
  return useQuery<Ingrediente>({
    queryKey: ['ingredientes', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Ingrediente>(`/ingredientes/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// POST crear
export const useCreateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newIngrediente: IngredienteCreate) => {
      const { data } = await apiClient.post<Ingrediente>('/ingredientes', newIngrediente);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

// PUT actualizar
export const useUpdateIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IngredienteUpdate }) => {
      const response = await apiClient.put<Ingrediente>(`/ingredientes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
      queryClient.invalidateQueries({ queryKey: ['ingredientes', variables.id] });
    },
  });
};

// DELETE eliminar
export const useDeleteIngrediente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/ingredientes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });
};

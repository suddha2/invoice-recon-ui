import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchServices,
  fetchService,
  createService,
  updateService,
  deleteService,
  fetchServiceUtilization,
  fetchAllServiceUtilizations,
  getPlacementRecommendations,
  calculateStackingAnalysis,
} from '@/lib/api/services';
import { Service } from '@/lib/types/service';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => fetchService(id),
    enabled: !!id,
  });
}

export function useServiceUtilization(id: string) {
  return useQuery({
    queryKey: ['service-utilization', id],
    queryFn: () => fetchServiceUtilization(id),
    enabled: !!id,
  });
}

export function useAllServiceUtilizations() {
  return useQuery({
    queryKey: ['service-utilizations'],
    queryFn: fetchAllServiceUtilizations,
  });
}

export function usePlacementRecommendations(
  newContract: { sharedHours: number; oneToOneHours: number; regionId: string; authorityId: string } | null
) {
  return useQuery({
    queryKey: ['placement-recommendations', newContract],
    queryFn: () => getPlacementRecommendations(newContract!),
    enabled: !!newContract,
  });
}

export function useStackingAnalysis(serviceId: string | null) {
  return useQuery({
    queryKey: ['stacking-analysis', serviceId],
    queryFn: () => calculateStackingAnalysis(serviceId!),
    enabled: !!serviceId,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service-utilizations'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
      updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service-utilizations'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service-utilizations'] });
    },
  });
}
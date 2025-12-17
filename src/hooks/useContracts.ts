import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractsApi from '@/lib/api/contracts';
import { CreateContractInput } from '@/lib/types/contract';

export function useContracts(authorityId?: string) {
  return useQuery({
    queryKey: ['contracts', authorityId],
    queryFn: () => contractsApi.fetchContracts(authorityId),
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractsApi.fetchContract(id),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateContractInput) => contractsApi.createContract(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      contractsApi.updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}
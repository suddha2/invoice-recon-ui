import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsApi from '@/lib/api/payments';

export function usePayments(authorityId?: string) {
  return useQuery({
    queryKey: ['payments', authorityId],
    queryFn: () => paymentsApi.fetchPayments(authorityId),
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.fetchPayment(id),
    enabled: !!id,
  });
}

export function useAllocationSuggestion(paymentId: string, enabled = false) {
  return useQuery({
    queryKey: ['allocation-suggestion', paymentId],
    queryFn: () => paymentsApi.suggestAllocation(paymentId),
    enabled: enabled && !!paymentId,
  });
}

export function useConfirmAllocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ paymentId, allocations }: { 
      paymentId: string; 
      allocations: Record<string, number> 
    }) => paymentsApi.confirmAllocation(paymentId, allocations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
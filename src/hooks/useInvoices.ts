import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as invoicesApi from '@/lib/api/invoices';

export function useInvoices(contractId?: string) {
  return useQuery({
    queryKey: ['invoices', contractId],
    queryFn: () => invoicesApi.fetchInvoices(contractId),
  });
}

export function useInvoiceDetails(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.fetchInvoiceDetails(id),
    enabled: !!id,
  });
}

export function useGenerateInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contractId, periodStart }: { 
      contractId: string; 
      periodStart: string 
    }) => invoicesApi.generateInvoice(contractId, periodStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useFinalizeInvoice() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => invoicesApi.finalizeInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
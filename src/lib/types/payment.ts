export interface PaymentReceived {
  id: string;
  authorityId: string;
  authorityName: string;
  amount: number;
  dateReceived: string;
  referenceNumber: string;
  periodLabel: string;
  status: 'pending_allocation' | 'allocated';
  createdAt: string;
}

export interface AllocationSuggestion {
  contractId: string;
  contractName: string;
  expectedAmount: number;
  suggestedAmount: number;
  variance: number;
}
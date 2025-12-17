import { PaymentReceived, AllocationSuggestion } from '@/lib/types/payment';
import { mockPayments } from '@/mocks/mockPayments';
import { mockContracts } from '@/mocks/mockContracts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchPayments(authorityId?: string): Promise<PaymentReceived[]> {
  await delay(300);
  
  if (authorityId) {
    return mockPayments.filter(p => p.authorityId === authorityId);
  }
  
  return [...mockPayments];
}

export async function fetchPayment(id: string): Promise<PaymentReceived> {
  await delay(200);
  
  const payment = mockPayments.find(p => p.id === id);
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  return payment;
}

export async function createPayment(
  data: Omit<PaymentReceived, 'id' | 'createdAt'>
): Promise<PaymentReceived> {
  await delay(500);
  
  const newPayment: PaymentReceived = {
    id: `payment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  
  mockPayments.push(newPayment);
  return newPayment;
}

export async function suggestAllocation(
  paymentId: string
): Promise<AllocationSuggestion[]> {
  await delay(400);
  
  const payment = mockPayments.find(p => p.id === paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  // Get active contracts for this authority
  const contracts = mockContracts.filter(
    c => c.authorityId === payment.authorityId && c.status === 'active'
  );
  
  // Calculate total expected amount across all contracts
  const totalExpected = contracts.reduce((sum, c) => {
    const expected = 
      (c.sharedHoursPerWeek * 4 * c.sharedRate) + 
      (c.oneToOneHoursPerWeek * 4 * c.oneToOneRate);
    return sum + expected;
  }, 0);
  
  // Suggest allocation proportionally
  return contracts.map(contract => {
    const expected = 
      (contract.sharedHoursPerWeek * 4 * contract.sharedRate) + 
      (contract.oneToOneHoursPerWeek * 4 * contract.oneToOneRate);
    const suggested = (expected / totalExpected) * payment.amount;
    
    return {
      contractId: contract.id,
      contractName: contract.serviceUserName,
      expectedAmount: Number(expected.toFixed(2)),
      suggestedAmount: Number(suggested.toFixed(2)),
      variance: Number((suggested - expected).toFixed(2)),
    };
  });
}

export async function confirmAllocation(
  paymentId: string,
  allocations: Record<string, number>
): Promise<void> {
  await delay(500);
  
  const payment = mockPayments.find(p => p.id === paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  // In real app, would save allocation details to backend
  payment.status = 'allocated';
  
  console.log('Payment allocated:', paymentId, allocations);
}
import { PaymentReceived } from '@/lib/types/payment';

export const mockPayments: PaymentReceived[] = [
  {
    id: 'payment-1',
    authorityId: 'auth-1',
    authorityName: 'City Council',
    amount: 52000.00,
    dateReceived: '2024-02-12',
    referenceNumber: 'REF123456',
    periodLabel: 'Period ending 2024-02-11',
    status: 'allocated',
    createdAt: '2024-02-12T09:00:00Z',
  },
  {
    id: 'payment-2',
    authorityId: 'auth-2',
    authorityName: 'County Social Services',
    amount: 13500.00,
    dateReceived: '2024-02-13',
    referenceNumber: 'REF789012',
    periodLabel: 'Period ending 2024-02-11',
    status: 'pending_allocation',
    createdAt: '2024-02-13T10:30:00Z',
  },
  {
    id: 'payment-3',
    authorityId: 'auth-1',
    authorityName: 'City Council',
    amount: 48500.00,
    dateReceived: '2024-03-12',
    referenceNumber: 'REF345678',
    periodLabel: 'Period ending 2024-03-10',
    status: 'pending_allocation',
    createdAt: '2024-03-12T11:15:00Z',
  },
];
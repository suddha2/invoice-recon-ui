import { Invoice, InvoiceDetails } from '@/lib/types/invoice';
import { mockInvoices, mockInvoiceLineItems } from '@/mocks/mockInvoice';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchInvoices(contractId?: string): Promise<Invoice[]> {
  await delay(300);
  
  if (contractId) {
    return mockInvoices.filter(i => i.contractId === contractId);
  }
  
  return [...mockInvoices];
}

export async function fetchInvoiceDetails(id: string): Promise<InvoiceDetails> {
  await delay(400);
  
  const invoice = mockInvoices.find(i => i.id === id);
  if (!invoice) {
    throw new Error('Invoice not found');
  }
  
  const lineItems = mockInvoiceLineItems[id] || [];
  
  return {
    ...invoice,
    lineItems,
  };
}

export async function generateInvoice(
  contractId: string,
  periodStart: string
): Promise<Invoice> {
  await delay(800); // Simulate longer generation time
  
  const newInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-2024-${String(mockInvoices.length + 1).padStart(6, '0')}`,
    contractId,
    contractName: 'Mock Contract', // Would lookup from contractId
    billingPeriodStart: periodStart,
    billingPeriodEnd: new Date(
      new Date(periodStart).getTime() + 27 * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0],
    status: 'draft',
    totalAmount: 0, // Would calculate from line items
    generatedAt: new Date().toISOString(),
  };
  
  mockInvoices.push(newInvoice);
  return newInvoice;
}

export async function updateInvoice(
  id: string,
  data: Partial<Invoice>
): Promise<Invoice> {
  await delay(500);
  
  const index = mockInvoices.findIndex(i => i.id === id);
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  
  mockInvoices[index] = { ...mockInvoices[index], ...data };
  return mockInvoices[index];
}

export async function finalizeInvoice(id: string): Promise<Invoice> {
  await delay(500);
  
  const invoice = mockInvoices.find(i => i.id === id);
  if (!invoice) {
    throw new Error('Invoice not found');
  }
  
  invoice.status = 'finalized';
  invoice.finalizedAt = new Date().toISOString();
  
  return invoice;
}

export async function deleteInvoice(id: string): Promise<void> {
  await delay(300);
  
  const index = mockInvoices.findIndex(i => i.id === id);
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  
  mockInvoices.splice(index, 1);
}
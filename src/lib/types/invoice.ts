export interface Invoice {
  id: string;
  invoiceNumber: string;
  contractId: string;
  contractName: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  status: 'draft' | 'finalized';
  totalAmount: number;
  generatedAt: string;
  finalizedAt?: string;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  lineType: string;
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
}

export interface InvoiceDetails extends Invoice {
  lineItems: InvoiceLineItem[];
}
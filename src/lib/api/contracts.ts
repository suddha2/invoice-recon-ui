import { Contract, CreateContractInput } from '../../lib/types/contract';
import { mockContracts } from '../../mocks/mockContracts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchContracts(authorityId?: string): Promise<Contract[]> {
  await delay(300);
  
  if (authorityId) {
    return mockContracts.filter(c => c.authorityId === authorityId);
  }
  
  return [...mockContracts]; // Return copy to avoid mutations
}

export async function fetchContract(id: string): Promise<Contract> {
  await delay(200);
  
  const contract = mockContracts.find(c => c.id === id);
  if (!contract) {
    throw new Error('Contract not found');
  }
  
  return contract;
}

export async function createContract(data: CreateContractInput): Promise<Contract> {
  await delay(500);
  
  const newContract: Contract = {
    id: `contract-${Date.now()}`,
    authorityName: 'Mock Authority', // In real app, would lookup from authorityId
    status: 'active',
    createdAt: new Date().toISOString(),
    ...data,
  };
  
  mockContracts.push(newContract);
  return newContract;
}

export async function updateContract(
  id: string,
  data: Partial<Contract>
): Promise<Contract> {
  await delay(500);
  
  const index = mockContracts.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Contract not found');
  }
  
  mockContracts[index] = { ...mockContracts[index], ...data };
  return mockContracts[index];
}

export async function deleteContract(id: string): Promise<void> {
  await delay(300);
  
  const index = mockContracts.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Contract not found');
  }
  
  mockContracts.splice(index, 1);
}
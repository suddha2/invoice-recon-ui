export interface Contract {
  id: string;
  authorityId: string;
  authorityName: string;
  serviceUserName: string;
  cycleStartDate: string;
  sharedHoursPerWeek: number;
  sharedRate: number;
  oneToOneHoursPerWeek: number;
  oneToOneRate: number;
  status: 'active' | 'terminated';
  terminatedDate?: string;
  createdAt: string;
}

export interface CreateContractInput {
  authorityId: string;
  serviceUserName: string;
  cycleStartDate: string;
  sharedHoursPerWeek: number;
  sharedRate: number;
  oneToOneHoursPerWeek: number;
  oneToOneRate: number;
}
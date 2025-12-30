export interface Contract {
  id: string;
  regionId: string;
  regionName: string;
  authorityId: string;
  authorityName: string;
  lotName: string; 
  serviceUserName: string;

// NEW: Service assignment
  serviceId?: string;
  serviceName?: string;
  roomNumber?: string;

  cycleStartDate: string;
  sharedHoursPerWeek: number;
  sharedRate: number;
  oneToOneHoursPerWeek: number;
  oneToOneRate: number;
  twoToOneHoursPerWeek: number;
  twoToOneRate: number;
  nightlyRate?: number;
  nightlyHoursPerWeek?: number;
  wakingNightRate?: number;
  wakingNightHoursPerWeek?: number;
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
import { Contract } from '../lib/types/contract';

export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    regionId: 'region-1',
    regionName: 'North',
    authorityId: 'auth-1',
    authorityName: 'City Council',
    lotName: 'Lot A',
    serviceUserName: 'John Smith',
    serviceId: 'service-1', // NEW
    serviceName: 'Greendale House', // NEW
    roomNumber: 'Room 1', // NEW
    cycleStartDate: '2024-01-15',
    sharedHoursPerWeek: 40,
    sharedRate: 20.00,
    oneToOneHoursPerWeek: 20,
    oneToOneRate: 25.75,
    twoToOneHoursPerWeek: 10,
    twoToOneRate: 30.00,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 'contract-2',
    regionId: 'region-1',
    regionName: 'North',
    authorityId: 'auth-1',
    authorityName: 'City Council',
    lotName: 'Lot A',
    serviceUserName: 'Jane Doe',
    serviceId: 'service-1', // NEW
    serviceName: 'Greendale House', // NEW
    roomNumber: 'Room 2', // NEW
    cycleStartDate: '2024-01-15',
    sharedHoursPerWeek: 40,
    sharedRate: 20.00,
    oneToOneHoursPerWeek: 20,
    oneToOneRate: 25.75,
    status: 'active',
    createdAt: '2024-01-15',
    twoToOneHoursPerWeek: 0,
    twoToOneRate: 0
  },
  {
    id: 'contract-3',
    regionId: 'region-2',
    regionName: 'South',
    authorityId: 'auth-1',
    authorityName: 'City Council',
    lotName: 'Lot B',
    serviceUserName: 'Bob Wilson',
    serviceId: 'service-1', // NEW
    serviceName: 'Greendale House', // NEW
    roomNumber: 'Room 3', // NEW
    cycleStartDate: '2024-02-01',
    sharedHoursPerWeek: 30,
    sharedRate: 19.57,
    oneToOneHoursPerWeek: 15,
    oneToOneRate: 26.78,
    status: 'active',
    createdAt: '2024-02-01',
    twoToOneHoursPerWeek: 0,
    twoToOneRate: 0
  },
  // Add more contracts with service assignments...
];
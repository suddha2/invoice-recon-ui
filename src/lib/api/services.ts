import { Service, ServiceUtilization, PlacementRecommendation, StackingAnalysis } from '@/lib/types/service';
import { Contract } from '@/lib/types/contract';
import { mockServices, mockRoomAssignments } from '@/mocks/mockServices';
import { mockContracts } from '@/mocks/mockContracts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchServices(): Promise<Service[]> {
  await delay(300);
  return [...mockServices];
}

export async function fetchService(id: string): Promise<Service | undefined> {
  await delay(200);
  return mockServices.find(s => s.id === id);
}

export async function createService(data: Omit<Service, 'id' | 'createdAt'>): Promise<Service> {
  await delay(500);
  const newService: Service = {
    ...data,
    id: `service-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockServices.push(newService);
  return newService;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  await delay(500);
  const index = mockServices.findIndex(s => s.id === id);
  if (index !== -1) {
    mockServices[index] = { ...mockServices[index], ...data };
    return mockServices[index];
  }
  throw new Error('Service not found');
}

export async function deleteService(id: string): Promise<void> {
  await delay(500);
  const index = mockServices.findIndex(s => s.id === id);
  if (index !== -1) {
    mockServices.splice(index, 1);
  }
}

// Calculate utilization for a service
export async function fetchServiceUtilization(serviceId: string): Promise<ServiceUtilization> {
  await delay(300);
  
  const service = mockServices.find(s => s.id === serviceId);
  if (!service) throw new Error('Service not found');
  
  const assignments = mockRoomAssignments.filter(a => a.serviceId === serviceId && a.status === 'active');
  const contractIds = assignments.map(a => a.contractId);
  const contracts = mockContracts.filter(c => contractIds.includes(c.id));
  
  const residents = assignments.map(assignment => {
    const contract = contracts.find(c => c.id === assignment.contractId);
    return {
      roomNumber: assignment.roomNumber,
      serviceUserName: assignment.serviceUserName,
      contractId: assignment.contractId,
      sharedHours: contract?.sharedHoursPerWeek || 0,
      oneToOneHours: contract?.oneToOneHoursPerWeek || 0,
      twoToOneHours: contract?.twoToOneHoursPerWeek || 0,
    };
  });
  
  const totalSharedHours = residents.reduce((sum, r) => sum + r.sharedHours, 0);
  const totalOneToOneHours = residents.reduce((sum, r) => sum + r.oneToOneHours, 0);
  const totalTwoToOneHours = residents.reduce((sum, r) => sum + r.twoToOneHours, 0);
  
  const occupiedRooms = assignments.length;
  const vacantRooms = service.totalRooms - occupiedRooms;
  const occupancyRate = (occupiedRooms / service.totalRooms) * 100;
  
  // Calculate efficiency
  let efficiencyRating: 'high' | 'medium' | 'low' = 'low';
  let efficiencyScore = 0;
  
  if (occupiedRooms >= 3 && totalSharedHours > 80) {
    efficiencyRating = 'high';
    efficiencyScore = 85 + (occupiedRooms * 3);
  } else if (occupiedRooms === 2) {
    efficiencyRating = 'medium';
    efficiencyScore = 60;
  } else if (occupiedRooms === 1) {
    efficiencyRating = 'low';
    efficiencyScore = 30;
  } else {
    efficiencyRating = 'low';
    efficiencyScore = 0;
  }
  
  const avgHourlyRate = 18;
  const estimatedWeeklyCost = (totalSharedHours + totalOneToOneHours + totalTwoToOneHours) * avgHourlyRate;
  
  return {
    serviceId: service.id,
    serviceName: service.name,
    address: service.address,
    regionName: service.regionName,
    totalRooms: service.totalRooms,
    occupiedRooms,
    vacantRooms,
    occupancyRate,
    totalSharedHours,
    totalOneToOneHours,
    totalTwoToOneHours,
    efficiencyRating,
    efficiencyScore,
    estimatedWeeklyCost,
    residents,
  };
}

// Get all service utilizations
export async function fetchAllServiceUtilizations(): Promise<ServiceUtilization[]> {
  await delay(400);
  return Promise.all(mockServices.map(s => fetchServiceUtilization(s.id)));
}

// Get placement recommendations for a new contract
export async function getPlacementRecommendations(
  newContract: { sharedHours: number; oneToOneHours: number; regionId: string; authorityId: string }
): Promise<PlacementRecommendation[]> {
  await delay(500);
  
  const utilizations = await fetchAllServiceUtilizations();
  const avgHourlyRate = 18;
  
  const recommendations: PlacementRecommendation[] = utilizations
    .filter(u => u.vacantRooms > 0)
    .map(util => {
      const service = mockServices.find(s => s.id === util.serviceId)!;
      
      // Calculate score
      let score = 0;
      
      // 1. Room availability (0-30 points)
      const vacancyRate = util.vacantRooms / util.totalRooms;
      score += vacancyRate * 30;
      
      // 2. Shared hour synergy (0-40 points)
      if (util.occupiedRooms > 0) {
        score += Math.min(util.occupiedRooms * 10, 40);
      }
      
      // 3. Geographic proximity (0-20 points)
      if (service.regionId === newContract.regionId) {
        score += 20;
      }
      
      // 4. Authority match (0-10 points)
      const contracts = mockContracts.filter(c => 
        util.residents.some(r => r.contractId === c.id)
      );
      if (contracts.some(c => c.authorityId === newContract.authorityId)) {
        score += 10;
      }
      
      // Calculate savings
      let estimatedAnnualSavings = 0;
      if (util.occupiedRooms > 0) {
        // Can leverage existing shared staff
        estimatedAnnualSavings = newContract.sharedHours * avgHourlyRate * 52 * 0.3; // 30% savings
      }
      
      // Determine recommendation level
      let recommendation: 'highly_recommended' | 'suitable' | 'not_recommended';
      if (score >= 70) recommendation = 'highly_recommended';
      else if (score >= 40) recommendation = 'suitable';
      else recommendation = 'not_recommended';
      
      // Generate reasoning
      let reasoning = '';
      if (util.occupiedRooms >= 3) {
        reasoning = 'High shared staff utilization - multiple residents can share support staff';
      } else if (util.occupiedRooms === 2) {
        reasoning = 'Good utilization - shared staff already present';
      } else if (util.occupiedRooms === 1) {
        reasoning = 'Low utilization - limited shared staff synergy';
      } else {
        reasoning = 'Would require dedicated staff for single resident';
      }
      
      // Get vacant room numbers
      const occupiedRoomNumbers = util.residents.map(r => r.roomNumber);
      const allRoomNumbers = Array.from({ length: service.totalRooms }, (_, i) => 
        service.id === 'service-3' ? `Unit ${String.fromCharCode(65 + i)}` : `Room ${i + 1}`
      );
      const vacantRoomNumbers = allRoomNumbers.filter(r => !occupiedRoomNumbers.includes(r));
      
      return {
        serviceId: util.serviceId,
        serviceName: util.serviceName,
        address: util.address,
        regionName: util.regionName,
        availableRooms: util.vacantRooms,
        vacantRoomNumbers,
        currentOccupancy: util.occupiedRooms,
        currentSharedHours: util.totalSharedHours,
        newOccupancy: util.occupiedRooms + 1,
        newSharedHours: util.totalSharedHours + newContract.sharedHours,
        efficiencyScore: Math.round(score),
        estimatedAnnualSavings: Math.round(estimatedAnnualSavings),
        reasoning,
        recommendation,
      };
    });
  
  // Sort by efficiency score (highest first)
  return recommendations.sort((a, b) => b.efficiencyScore - a.efficiencyScore);
}

// Calculate stacking analysis
export async function calculateStackingAnalysis(serviceId: string): Promise<StackingAnalysis> {
  await delay(300);
  
  const util = await fetchServiceUtilization(serviceId);
  const avgHourlyRate = 18;
  
  // Without stacking: each resident needs separate shared staff
  const currentStaffHours = util.totalSharedHours;
  const currentWeeklyCost = currentStaffHours * avgHourlyRate;
  
  // With stacking: one staff can cover multiple residents simultaneously
  // Assume 70% efficiency (can overlap most shared hours)
  const stackedStaffHours = Math.max(util.totalSharedHours * 0.3, 40); // Minimum 40 hours
  const stackedWeeklyCost = stackedStaffHours * avgHourlyRate;
  
  const hoursSaved = currentStaffHours - stackedStaffHours;
  const weeklySavings = currentWeeklyCost - stackedWeeklyCost;
  const annualSavings = weeklySavings * 52;
  
  return {
    serviceId,
    currentStaffHours,
    currentWeeklyCost,
    stackedStaffHours,
    stackedWeeklyCost,
    hoursSaved,
    weeklySavings,
    annualSavings,
  };
}
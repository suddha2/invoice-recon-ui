export interface Service {
  id: string;
  name: string;
  address: string;
  regionId: string;
  regionName: string;
  totalRooms: number;
  createdAt: string;
}

export interface RoomAssignment {
  id: string;
  serviceId: string;
  serviceName: string;
  roomNumber: string;
  contractId: string;
  serviceUserName: string;
  assignedDate: string;
  status: 'active' | 'vacated';
}

export interface ServiceUtilization {
  serviceId: string;
  serviceName: string;
  address: string;
  regionName: string;
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  occupancyRate: number;
  
  // Aggregated hours
  totalSharedHours: number;
  totalOneToOneHours: number;
  totalTwoToOneHours: number;
  
  // Efficiency
  efficiencyRating: 'high' | 'medium' | 'low';
  efficiencyScore: number; // 0-100
  estimatedWeeklyCost: number;
  
  // Residents
  residents: {
    roomNumber: string;
    serviceUserName: string;
    contractId: string;
    sharedHours: number;
    oneToOneHours: number;
    twoToOneHours: number;
  }[];
}

export interface PlacementRecommendation {
  serviceId: string;
  serviceName: string;
  address: string;
  regionName: string;
  availableRooms: number;
  vacantRoomNumbers: string[];
  
  // Current state
  currentOccupancy: number;
  currentSharedHours: number;
  
  // With new contract
  newOccupancy: number;
  newSharedHours: number;
  
  // Scoring
  efficiencyScore: number; // 0-100
  estimatedAnnualSavings: number;
  reasoning: string;
  recommendation: 'highly_recommended' | 'suitable' | 'not_recommended';
}

export interface StackingAnalysis {
  serviceId: string;
  
  // Without stacking
  currentStaffHours: number;
  currentWeeklyCost: number;
  
  // With stacking
  stackedStaffHours: number;
  stackedWeeklyCost: number;
  
  // Savings
  hoursSaved: number;
  weeklySavings: number;
  annualSavings: number;
}
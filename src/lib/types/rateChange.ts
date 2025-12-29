export type RateChangeWorkflow = 'authority' | 'lot' | 'individual';
export type RateChangeMethod = 'percentage' | 'fixed';

export interface RateChangeRequest {
  workflow: RateChangeWorkflow;
  authorityId?: string;
  lotName?: string;
  contractIds: string[];
  method: RateChangeMethod;
  percentageIncrease?: number;
  applyToShared: boolean;
  applyToOneToOne: boolean;
  applyToTwoToOne: boolean;
  applyToNight: boolean;
  newSharedRate?: number;
  newOneToOneRate?: number;
  newTwoToOneRate?: number;
  newNightRate?: number;
  effectiveFrom: string;
  reason: string;
}

export interface RateChangePreview {
  contractId: string;
  serviceUserName: string;
  oldSharedRate: number;
  newSharedRate: number;
  oldOneToOneRate: number;
  newOneToOneRate: number;
  oldTwoToOneRate?: number;
  newTwoToOneRate?: number;
  sharedChange: number;
  oneToOneChange: number;
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stepper, Step, StepLabel, Paper } from '@mui/material';
import { RateChangeWorkflow } from '@/lib/types/rateChange';
import Step1SelectWorkflow from '@/components/rateChange/Step1SelectWorkflow';
import Step2SelectScope from '@/components/rateChange/Step2SelectScope';
import Step3SelectContracts from '@/components/rateChange/Step3SelectContracts';
import Step4EnterRates from '@/components/rateChange/Step4EnterRates';
import Step5ReviewConfirm from '@/components/rateChange/Step5ReviewConfirm';

const steps = [
  'Select Workflow',
  'Select Scope',
  'Select Contracts',
  'Enter Rates',
  'Review & Confirm',
];

export default function RateChangePage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  
  // Wizard state
  const [workflow, setWorkflow] = useState<RateChangeWorkflow | null>(null);
  const [authorityId, setAuthorityId] = useState<string>('');
  const [lotName, setLotName] = useState<string>('');
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
  const [method, setMethod] = useState<'percentage' | 'fixed'>('percentage');
  const [percentageIncrease, setPercentageIncrease] = useState<number>(3);
  const [applyToShared, setApplyToShared] = useState(true);
  const [applyToOneToOne, setApplyToOneToOne] = useState(true);
  const [applyToTwoToOne, setApplyToTwoToOne] = useState(false);
  const [applyToNight, setApplyToNight] = useState(false);
  const [newSharedRate, setNewSharedRate] = useState<number>(0);
  const [newOneToOneRate, setNewOneToOneRate] = useState<number>(0);
  const [effectiveFrom, setEffectiveFrom] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/contracts');
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1SelectWorkflow
            workflow={workflow}
            onWorkflowChange={setWorkflow}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        );
      case 1:
        return (
          <Step2SelectScope
            workflow={workflow!}
            authorityId={authorityId}
            lotName={lotName}
            onAuthorityChange={setAuthorityId}
            onLotChange={setLotName}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <Step3SelectContracts
            workflow={workflow!}
            authorityId={authorityId}
            lotName={lotName}
            selectedContractIds={selectedContractIds}
            onSelectionChange={setSelectedContractIds}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step4EnterRates
            selectedContractIds={selectedContractIds}
            method={method}
            percentageIncrease={percentageIncrease}
            applyToShared={applyToShared}
            applyToOneToOne={applyToOneToOne}
            applyToTwoToOne={applyToTwoToOne}
            applyToNight={applyToNight}
            newSharedRate={newSharedRate}
            newOneToOneRate={newOneToOneRate}
            effectiveFrom={effectiveFrom}
            reason={reason}
            onMethodChange={setMethod}
            onPercentageChange={setPercentageIncrease}
            onApplyToSharedChange={setApplyToShared}
            onApplyToOneToOneChange={setApplyToOneToOne}
            onApplyToTwoToOneChange={setApplyToTwoToOne}
            onApplyToNightChange={setApplyToNight}
            onNewSharedRateChange={setNewSharedRate}
            onNewOneToOneRateChange={setNewOneToOneRate}
            onEffectiveFromChange={setEffectiveFrom}
            onReasonChange={setReason}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step5ReviewConfirm
            workflow={workflow!}
            authorityId={authorityId}
            lotName={lotName}
            selectedContractIds={selectedContractIds}
            method={method}
            percentageIncrease={percentageIncrease}
            applyToShared={applyToShared}
            applyToOneToOne={applyToOneToOne}
            newSharedRate={newSharedRate}
            newOneToOneRate={newOneToOneRate}
            effectiveFrom={effectiveFrom}
            reason={reason}
            onBack={handleBack}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 4 }}>
        {renderStepContent()}
      </Paper>
    </Box>
  );
}
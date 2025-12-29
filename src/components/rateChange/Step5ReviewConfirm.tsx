import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RateChangeWorkflow } from '@/lib/types/rateChange';
import { useContracts } from '@/hooks/useContracts';
import { formatCurrency } from '@/lib/utils/formatting';

interface Props {
  workflow: RateChangeWorkflow;
  authorityId: string;
  lotName: string;
  selectedContractIds: string[];
  method: 'percentage' | 'fixed';
  percentageIncrease: number;
  applyToShared: boolean;
  applyToOneToOne: boolean;
  newSharedRate: number;
  newOneToOneRate: number;
  effectiveFrom: string;
  reason: string;
  onBack: () => void;
  onCancel: () => void;
}

export default function Step5ReviewConfirm(props: Props) {
  const navigate = useNavigate();
  const { data: allContracts } = useContracts();
  const [confirmed1, setConfirmed1] = useState(false);
  const [confirmed2, setConfirmed2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedContracts = allContracts?.filter((c) =>
    props.selectedContractIds.includes(c.id)
  );
  const authorityName = selectedContracts?.[0]?.authorityName || '';

  const getWorkflowLabel = () => {
    if (props.workflow === 'authority') return `Authority-wide (${authorityName})`;
    if (props.workflow === 'lot') return `Lot-level (${authorityName} - ${props.lotName})`;
    return 'Individual contract';
  };

  const getChangeDescription = () => {
    if (props.method === 'percentage') {
      const types = [];
      if (props.applyToShared) types.push('Shared');
      if (props.applyToOneToOne) types.push('1:1');
      return `+${props.percentageIncrease}% on ${types.join(' & ')} rates`;
    } else {
      const parts = [];
      if (props.applyToShared)
        parts.push(`Shared → ${formatCurrency(props.newSharedRate)}`);
      if (props.applyToOneToOne)
        parts.push(`1:1 → ${formatCurrency(props.newOneToOneRate)}`);
      return parts.join(', ');
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Call actual API to create rate change records
    console.log('Applying rate changes:', {
      workflow: props.workflow,
      contractIds: props.selectedContractIds,
      method: props.method,
      percentageIncrease: props.percentageIncrease,
      effectiveFrom: props.effectiveFrom,
      reason: props.reason,
    });

    setIsSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Rate Changes Applied Successfully
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {props.selectedContractIds.length} contracts have been updated
        </Typography>

        <Paper sx={{ p: 3, mb: 4, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
          <Typography variant="subtitle2" gutterBottom>
            Summary:
          </Typography>
          <Typography variant="body2">
            • {props.selectedContractIds.length} rate change records created
          </Typography>
          <Typography variant="body2">• Effective from: {props.effectiveFrom}</Typography>
          <Typography variant="body2">• Change ID: RC-2025-{Date.now()}</Typography>
        </Paper>

        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            <strong>What's Next?</strong>
          </Typography>
          <Typography variant="body2">
            • Contracts will use new rates for billing cycles starting on or after{' '}
            {props.effectiveFrom}
          </Typography>
          <Typography variant="body2">
            • You can view the rate change history in each contract
          </Typography>
          <Typography variant="body2">
            • Generate new invoices after the effective date to apply the updated rates
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={() => navigate('/contracts')}>
            Go to Contracts
          </Button>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Done
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review & Confirm
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        Important: Please review carefully before confirming
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Summary:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ width: 150, fontWeight: 'bold' }}>
              Scope:
            </Typography>
            <Typography variant="body2">{getWorkflowLabel()}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ width: 150, fontWeight: 'bold' }}>
              Contracts:
            </Typography>
            <Typography variant="body2">
              {props.selectedContractIds.length} active contracts
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ width: 150, fontWeight: 'bold' }}>
              Change Type:
            </Typography>
            <Typography variant="body2">{getChangeDescription()}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ width: 150, fontWeight: 'bold' }}>
              Effective Date:
            </Typography>
            <Typography variant="body2">{props.effectiveFrom}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="body2" sx={{ width: 150, fontWeight: 'bold' }}>
              Reason:
            </Typography>
            <Typography variant="body2">{props.reason}</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Impact:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">
            • {props.selectedContractIds.length} rate change records will be created
          </Typography>
          <Typography variant="body2">
            • Changes apply to billing cycles from {props.effectiveFrom}
          </Typography>
          <Typography variant="body2">• Previous invoices remain unchanged</Typography>
          <Typography variant="body2">• Audit trail will be preserved</Typography>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Confirmation:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox checked={confirmed1} onChange={(e) => setConfirmed1(e.target.checked)} />
          }
          label="I have reviewed the preview and confirm these changes"
        />
        <FormControlLabel
          control={
            <Checkbox checked={confirmed2} onChange={(e) => setConfirmed2(e.target.checked)} />
          }
          label="I understand this action cannot be easily undone"
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button onClick={props.onBack}>Back</Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={!confirmed1 || !confirmed2 || isSubmitting}
          >
            {isSubmitting ? 'Applying Changes...' : '✓ Apply Rate Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
} from '@mui/material';
import { useContracts } from '@/hooks/useContracts';
import { formatCurrency } from '@/lib/utils/formatting';
import { RateChangePreview } from '@/lib/types/rateChange';

interface Props {
  selectedContractIds: string[];
  method: 'percentage' | 'fixed';
  percentageIncrease: number;
  applyToShared: boolean;
  applyToOneToOne: boolean;
  applyToTwoToOne: boolean;
  applyToNight: boolean;
  newSharedRate: number;
  newOneToOneRate: number;
  effectiveFrom: string;
  reason: string;
  onMethodChange: (method: 'percentage' | 'fixed') => void;
  onPercentageChange: (value: number) => void;
  onApplyToSharedChange: (value: boolean) => void;
  onApplyToOneToOneChange: (value: boolean) => void;
  onApplyToTwoToOneChange: (value: boolean) => void;
  onApplyToNightChange: (value: boolean) => void;
  onNewSharedRateChange: (value: number) => void;
  onNewOneToOneRateChange: (value: number) => void;
  onEffectiveFromChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4EnterRates(props: Props) {
  const { data: allContracts } = useContracts();
  const [showPreview, setShowPreview] = useState(false);

  const selectedContracts = allContracts?.filter((c) =>
    props.selectedContractIds.includes(c.id)
  ) || [];

  // Calculate preview
  const preview: RateChangePreview[] = selectedContracts.map((contract) => {
    let newSharedRate = contract.sharedRate;
    let newOneToOneRate = contract.oneToOneRate;

    if (props.method === 'percentage') {
      if (props.applyToShared) {
        newSharedRate = contract.sharedRate * (1 + props.percentageIncrease / 100);
      }
      if (props.applyToOneToOne) {
        newOneToOneRate = contract.oneToOneRate * (1 + props.percentageIncrease / 100);
      }
    } else {
      if (props.applyToShared) {
        newSharedRate = props.newSharedRate;
      }
      if (props.applyToOneToOne) {
        newOneToOneRate = props.newOneToOneRate;
      }
    }

    return {
      contractId: contract.id,
      serviceUserName: contract.serviceUserName,
      oldSharedRate: contract.sharedRate,
      newSharedRate: Number(newSharedRate.toFixed(2)),
      oldOneToOneRate: contract.oneToOneRate,
      newOneToOneRate: Number(newOneToOneRate.toFixed(2)),
      sharedChange: Number((newSharedRate - contract.sharedRate).toFixed(2)),
      oneToOneChange: Number((newOneToOneRate - contract.oneToOneRate).toFixed(2)),
    };
  });

  const averageIncrease =
    preview.reduce((sum, p) => sum + p.sharedChange, 0) / preview.length;

  const canProceed =
    props.effectiveFrom &&
    props.reason &&
    (props.method === 'percentage' || (props.newSharedRate > 0 || props.newOneToOneRate > 0));

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Enter New Rates & Preview
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {props.selectedContractIds.length} contracts selected
      </Typography>

      {/* Rate Change Method */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Rate Change Method:
        </Typography>
        <FormControl>
          <RadioGroup
            value={props.method}
            onChange={(e) => props.onMethodChange(e.target.value as 'percentage' | 'fixed')}
          >
            <FormControlLabel
              value="percentage"
              control={<Radio />}
              label="Percentage Increase"
            />
            <FormControlLabel value="fixed" control={<Radio />} label="Fixed New Rate" />
          </RadioGroup>
        </FormControl>

        {props.method === 'percentage' ? (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <TextField
              label="Percentage Increase"
              type="number"
              value={props.percentageIncrease}
              onChange={(e) => props.onPercentageChange(Number(e.target.value))}
              InputProps={{ endAdornment: '%' }}
              sx={{ width: 200, mb: 2 }}
              inputProps={{ step: 0.1 }}
            />

            <Typography variant="body2" gutterBottom>
              Apply to:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.applyToShared}
                    onChange={(e) => props.onApplyToSharedChange(e.target.checked)}
                  />
                }
                label="Shared Support Rate"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.applyToOneToOne}
                    onChange={(e) => props.onApplyToOneToOneChange(e.target.checked)}
                  />
                }
                label="1:1 Support Rate"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.applyToTwoToOne}
                    onChange={(e) => props.onApplyToTwoToOneChange(e.target.checked)}
                  />
                }
                label="2:1 Support Rate"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.applyToNight}
                    onChange={(e) => props.onApplyToNightChange(e.target.checked)}
                  />
                }
                label="Night Support Rate"
              />
            </Box>

            {preview.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Preview calculation:
                </Typography>
                <Typography variant="body2">
                  • £{preview[0].oldSharedRate.toFixed(2)} → £
                  {preview[0].newSharedRate.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This will override all current rates with the values you specify
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={props.applyToShared}
                  onChange={(e) => props.onApplyToSharedChange(e.target.checked)}
                />
                <TextField
                  label="New Shared Rate"
                  type="number"
                  value={props.newSharedRate || ''}
                  onChange={(e) => props.onNewSharedRateChange(Number(e.target.value))}
                  disabled={!props.applyToShared}
                  InputProps={{ startAdornment: '£' }}
                  sx={{ width: 200 }}
                  inputProps={{ step: 0.01 }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Checkbox
                  checked={props.applyToOneToOne}
                  onChange={(e) => props.onApplyToOneToOneChange(e.target.checked)}
                />
                <TextField
                  label="New 1:1 Rate"
                  type="number"
                  value={props.newOneToOneRate || ''}
                  onChange={(e) => props.onNewOneToOneRateChange(Number(e.target.value))}
                  disabled={!props.applyToOneToOne}
                  InputProps={{ startAdornment: '£' }}
                  sx={{ width: 200 }}
                  inputProps={{ step: 0.01 }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Effective From & Reason */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Effective From Date"
          type="date"
          value={props.effectiveFrom}
          onChange={(e) => props.onEffectiveFromChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <Alert severity="info" sx={{ mb: 2 }}>
          Rate changes will apply to billing cycles starting on or after this date. Existing
          invoices are not affected.
        </Alert>

        <TextField
          label="Reason/Description"
          value={props.reason}
          onChange={(e) => props.onReasonChange(e.target.value)}
          multiline
          rows={3}
          fullWidth
          required
          placeholder="e.g., Annual uplift 2025 - 3% increase approved by council"
        />
      </Box>

      {/* Preview Button */}
      <Button variant="outlined" onClick={() => setShowPreview(!showPreview)} sx={{ mb: 2 }}>
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </Button>

      {/* Preview Table */}
      <Collapse in={showPreview}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Impact Summary:</Typography>
          <Typography variant="body2">
            • {preview.length} contracts will be updated
          </Typography>
          <Typography variant="body2">
            • Rate changes effective: {props.effectiveFrom || 'Not set'}
          </Typography>
          {props.method === 'percentage' && (
            <Typography variant="body2">
              • Average increase: {formatCurrency(averageIncrease)}/hour (
              {props.percentageIncrease}%)
            </Typography>
          )}
        </Alert>

        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Service User</TableCell>
                <TableCell align="right">Old Shared</TableCell>
                <TableCell align="right">New Shared</TableCell>
                <TableCell align="right">Old 1:1</TableCell>
                <TableCell align="right">New 1:1</TableCell>
                <TableCell align="right">Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preview.map((row) => (
                <TableRow key={row.contractId}>
                  <TableCell>{row.serviceUserName}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(row.oldSharedRate)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        row.newSharedRate > row.oldSharedRate
                          ? 'success.main'
                          : 'inherit',
                    }}
                  >
                    {formatCurrency(row.newSharedRate)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(row.oldOneToOneRate)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        row.newOneToOneRate > row.oldOneToOneRate
                          ? 'success.main'
                          : 'inherit',
                    }}
                  >
                    {formatCurrency(row.newOneToOneRate)}
                  </TableCell>
                  <TableCell align="right">
                    {row.sharedChange > 0 ? '+' : ''}
                    {formatCurrency(row.sharedChange)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button onClick={props.onBack}>Back</Button>
        <Button variant="contained" onClick={props.onNext} disabled={!canProceed}>
          Next: Review & Confirm
        </Button>
      </Box>
    </Box>
  );
}
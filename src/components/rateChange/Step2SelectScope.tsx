import { Box, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import { RateChangeWorkflow } from '@/lib/types/rateChange';
import { useContracts } from '@/hooks/useContracts';

interface Props {
  workflow: RateChangeWorkflow;
  authorityId: string;
  lotName: string;
  onAuthorityChange: (value: string) => void;
  onLotChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2SelectScope({
  workflow,
  authorityId,
  lotName,
  onAuthorityChange,
  onLotChange,
  onNext,
  onBack,
}: Props) {
  const { data: allContracts } = useContracts();

  // Get unique authorities
  const authorities = Array.from(
    new Set(allContracts?.map((c) => c.authorityId) || [])
  ).map((id) => {
    const contract = allContracts?.find((c) => c.authorityId === id);
    return { id, name: contract?.authorityName || '' };
  });

  // Get unique lots for selected authority
  const lots = Array.from(
    new Set(
      allContracts
        ?.filter((c) => c.authorityId === authorityId && c.status === 'active')
        .map((c) => c.lotName) || []
    )
  );

  // Filter contracts based on selection
  const filteredContracts = allContracts?.filter((c) => {
    if (workflow === 'authority') {
      return c.authorityId === authorityId && c.status === 'active';
    }
    if (workflow === 'lot') {
      return c.authorityId === authorityId && c.lotName === lotName && c.status === 'active';
    }
    return false;
  });

  const contractCount = filteredContracts?.length || 0;
  const rateRange =
    contractCount > 0
      ? {
          min: Math.min(...filteredContracts!.map((c) => c.sharedRate)),
          max: Math.max(...filteredContracts!.map((c) => c.sharedRate)),
        }
      : null;

  // Count by region
  const regionCounts =
    filteredContracts?.reduce((acc, c) => {
      acc[c.regionName] = (acc[c.regionName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

  // Count by lot (for authority workflow)
  const lotCounts =
    workflow === 'authority'
      ? filteredContracts?.reduce((acc, c) => {
          acc[c.lotName] = (acc[c.lotName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {}
      : {};

  const canProceed =
    workflow === 'individual' || (workflow === 'authority' && authorityId) || (workflow === 'lot' && authorityId && lotName);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {workflow === 'authority' && 'Select Authority'}
        {workflow === 'lot' && 'Select Lot'}
        {workflow === 'individual' && 'Select Contract'}
      </Typography>

      <Box sx={{ mb: 4, mt: 3 }}>
        <TextField
          select
          fullWidth
          label="Select Authority"
          value={authorityId}
          onChange={(e) => onAuthorityChange(e.target.value)}
          required
        >
          <MenuItem value="">
            <em>Select an authority...</em>
          </MenuItem>
          {authorities.map((auth) => (
            <MenuItem key={auth.id} value={auth.id}>
              {auth.name}
            </MenuItem>
          ))}
        </TextField>

        {workflow === 'lot' && authorityId && (
          <TextField
            select
            fullWidth
            label="Select Lot"
            value={lotName}
            onChange={(e) => onLotChange(e.target.value)}
            required
            sx={{ mt: 2 }}
          >
            <MenuItem value="">
              <em>Select a lot...</em>
            </MenuItem>
            {lots.map((lot) => (
              <MenuItem key={lot} value={lot}>
                {lot}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {authorityId && (workflow === 'authority' || (workflow === 'lot' && lotName)) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>
          <Typography variant="body2">• {contractCount} Active Contracts</Typography>
          {Object.keys(regionCounts).length > 0 && (
            <Typography variant="body2">
              • Regions: {Object.entries(regionCounts).map(([r, c]) => `${r} (${c})`).join(', ')}
            </Typography>
          )}
          {workflow === 'authority' && Object.keys(lotCounts).length > 0 && (
            <Typography variant="body2">
              • Lots: {Object.entries(lotCounts).map(([l, c]) => `${l} (${c})`).join(', ')}
            </Typography>
          )}
          {rateRange && (
            <Typography variant="body2">
              • Current Rate Range: £{rateRange.min.toFixed(2)} - £{rateRange.max.toFixed(2)}
            </Typography>
          )}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext} disabled={!canProceed}>
          Next: Select Contracts
        </Button>
      </Box>
    </Box>
  );
}
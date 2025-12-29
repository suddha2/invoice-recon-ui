import { Box, Typography, Button, Card, CardContent, CardActionArea, Radio } from '@mui/material';
import { RateChangeWorkflow } from '@/lib/types/rateChange';

interface Props {
  workflow: RateChangeWorkflow | null;
  onWorkflowChange: (workflow: RateChangeWorkflow) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function Step1SelectWorkflow({ workflow, onWorkflowChange, onNext, onCancel }: Props) {
  const workflows: { value: RateChangeWorkflow; title: string; description: string }[] = [
    {
      value: 'authority',
      title: 'Across Authority (Council-wide)',
      description: 'Apply rate changes to all contracts under a selected authority/council',
    },
    {
      value: 'lot',
      title: 'Across Lot (Group)',
      description: 'Apply rate changes to all contracts within a specific Lot under an authority',
    },
    {
      value: 'individual',
      title: 'Individual Contract',
      description: 'Update rates for a single service user contract',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Update Scope
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        How would you like to update rates?
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {workflows.map((wf) => (
          <Card
            key={wf.value}
            variant="outlined"
            sx={{
              border: workflow === wf.value ? 2 : 1,
              borderColor: workflow === wf.value ? 'primary.main' : 'divider',
            }}
          >
            <CardActionArea onClick={() => onWorkflowChange(wf.value)}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Radio checked={workflow === wf.value} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{wf.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {wf.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onNext} disabled={!workflow}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
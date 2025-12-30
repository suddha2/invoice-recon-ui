import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ServiceForm from '@/components/services/ServiceForm';
import { useCreateService } from '@/hooks/useServices';

export default function NewServicePage() {
  const navigate = useNavigate();
  const createService = useCreateService();

  const handleSubmit = async (data: any) => {
    try {
      const regionName = 
        data.regionId === 'region-1' ? 'North' :
        data.regionId === 'region-2' ? 'South' :
        data.regionId === 'region-3' ? 'East' : 'West';

      await createService.mutateAsync({
        ...data,
        regionName,
      });
      navigate('/services');
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')}>
          Back
        </Button>
        <Typography variant="h4">Add New Service</Typography>
      </Box>

      <ServiceForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/services')}
        isSubmitting={createService.isPending}
      />
    </Box>
  );
}
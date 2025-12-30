import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ServiceForm from '@/components/services/ServiceForm';
import { useService, useUpdateService } from '@/hooks/useServices';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: service, isLoading } = useService(id!);
  const updateService = useUpdateService();

  const handleSubmit = async (data: any) => {
    try {
      const regionName = 
        data.regionId === 'region-1' ? 'North' :
        data.regionId === 'region-2' ? 'South' :
        data.regionId === 'region-3' ? 'East' : 'West';

      await updateService.mutateAsync({
        id: id!,
        data: { ...data, regionName },
      });
      navigate(`/services/${id}`);
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!service) {
    return <Typography>Service not found</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/services/${id}`)}>
          Back
        </Button>
        <Typography variant="h4">Edit Service</Typography>
      </Box>

      <ServiceForm
        initialData={service}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/services/${id}`)}
        isSubmitting={updateService.isPending}
      />
    </Box>
  );
}
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { Service } from '@/lib/types/service';

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  address: z.string().min(1, 'Address is required'),
  regionId: z.string().min(1, 'Region is required'),
  totalRooms: z.number().min(1, 'Must have at least 1 room').max(50, 'Maximum 50 rooms'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Props {
  initialData?: Service;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const mockRegions = [
  { id: 'region-1', name: 'North' },
  { id: 'region-2', name: 'South' },
  { id: 'region-3', name: 'East' },
  { id: 'region-4', name: 'West' },
];

export default function ServiceForm({ initialData, onSubmit, onCancel, isSubmitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          address: initialData.address,
          regionId: initialData.regionId,
          totalRooms: initialData.totalRooms,
        }
      : {
          totalRooms: 5,
        },
  });

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? 'Edit Service' : 'Add New Service'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          <TextField
            label="Service Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
            placeholder="e.g., Greendale House"
          />

          <TextField
            label="Address"
            {...register('address')}
            error={!!errors.address}
            helperText={errors.address?.message}
            fullWidth
            required
            placeholder="e.g., 123 Main Street, Northville"
          />

          <TextField
            select
            label="Region"
            {...register('regionId')}
            error={!!errors.regionId}
            helperText={errors.regionId?.message}
            fullWidth
            required
          >
            <MenuItem value="">
              <em>Select a region</em>
            </MenuItem>
            {mockRegions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Total Rooms"
            type="number"
            {...register('totalRooms', { valueAsNumber: true })}
            error={!!errors.totalRooms}
            helperText={errors.totalRooms?.message}
            fullWidth
            required
            inputProps={{ min: 1, max: 50 }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
}
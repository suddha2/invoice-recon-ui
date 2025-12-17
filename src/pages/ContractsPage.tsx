import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useContracts, useCreateContract } from '@/hooks/useContracts';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contractSchema = z.object({
  authorityId: z.string().min(1, 'Authority is required'),
  serviceUserName: z.string().min(1, 'Service user name is required'),
  cycleStartDate: z.string().min(1, 'Cycle start date is required'),
  sharedHoursPerWeek: z.number().min(0, 'Must be 0 or greater'),
  sharedRate: z.number().min(0, 'Must be 0 or greater'),
  oneToOneHoursPerWeek: z.number().min(0, 'Must be 0 or greater'),
  oneToOneRate: z.number().min(0, 'Must be 0 or greater'),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function ContractsPage() {
  //const navigate = useNavigate();
  const { data: contracts, isLoading } = useContracts();
  const createContract = useCreateContract();
  
  const [openDialog, setOpenDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      sharedHoursPerWeek: 0,
      sharedRate: 0,
      oneToOneHoursPerWeek: 0,
      oneToOneRate: 0,
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'serviceUserName',
      headerName: 'Service User',
      width: 200,
      flex: 1,
    },
    {
      field: 'authorityName',
      headerName: 'Authority',
      width: 180,
      flex: 1,
    },
    {
      field: 'sharedRate',
      headerName: 'Shared Rate',
      width: 130,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'sharedHoursPerWeek',
      headerName: 'Shared Hours/Week',
      width: 160,
    },
    {
      field: 'oneToOneRate',
      headerName: '1:1 Rate',
      width: 130,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'oneToOneHoursPerWeek',
      headerName: '1:1 Hours/Week',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'cycleStartDate',
      headerName: 'Cycle Start',
      width: 130,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Open edit dialog
            console.log('Edit contract:', params.row.id);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const handleOpenDialog = () => {
    reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  const onSubmit = async (data: ContractFormData) => {
    try {
      await createContract.mutateAsync(data);
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Contracts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Contract
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={contracts || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          sx={{
            bgcolor: 'background.paper',
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Create Contract Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Contract</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label="Authority"
                {...register('authorityId')}
                error={!!errors.authorityId}
                helperText={errors.authorityId?.message}
                fullWidth
              >
                <MenuItem value="auth-1">City Council</MenuItem>
                <MenuItem value="auth-2">County Social Services</MenuItem>
              </TextField>

              <TextField
                label="Service User Name"
                {...register('serviceUserName')}
                error={!!errors.serviceUserName}
                helperText={errors.serviceUserName?.message}
                fullWidth
              />

              <TextField
                label="Cycle Start Date"
                type="date"
                {...register('cycleStartDate')}
                error={!!errors.cycleStartDate}
                helperText={errors.cycleStartDate?.message}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Shared Hours per Week"
                  type="number"
                  {...register('sharedHoursPerWeek', { valueAsNumber: true })}
                  error={!!errors.sharedHoursPerWeek}
                  helperText={errors.sharedHoursPerWeek?.message}
                  inputProps={{ step: 0.5 }}
                />

                <TextField
                  label="Shared Rate (£/hour)"
                  type="number"
                  {...register('sharedRate', { valueAsNumber: true })}
                  error={!!errors.sharedRate}
                  helperText={errors.sharedRate?.message}
                  inputProps={{ step: 0.01 }}
                />

                <TextField
                  label="1:1 Hours per Week"
                  type="number"
                  {...register('oneToOneHoursPerWeek', { valueAsNumber: true })}
                  error={!!errors.oneToOneHoursPerWeek}
                  helperText={errors.oneToOneHoursPerWeek?.message}
                  inputProps={{ step: 0.5 }}
                />

                <TextField
                  label="1:1 Rate (£/hour)"
                  type="number"
                  {...register('oneToOneRate', { valueAsNumber: true })}
                  error={!!errors.oneToOneRate}
                  helperText={errors.oneToOneRate?.message}
                  inputProps={{ step: 0.01 }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={createContract.isPending}>
              {createContract.isPending ? 'Creating...' : 'Create Contract'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
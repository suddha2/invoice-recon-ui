import { useState } from 'react';
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
  Alert,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useContracts, useCreateContract, useUpdateContract } from '@/hooks/useContracts';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ServiceAssignmentStep from '@/components/contracts/ServiceAssignmentStep';

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
  const { data: contracts, isLoading } = useContracts();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [createStep, setCreateStep] = useState<'basic' | 'service' | 'rates'>('basic');
  const [tempContractData, setTempContractData] = useState<any>({});

  // Reassignment dialog state
  const [openReassignDialog, setOpenReassignDialog] = useState(false);
  const [selectedContractForReassign, setSelectedContractForReassign] = useState<any>(null);
  const [reassignServiceId, setReassignServiceId] = useState<string | null>(null);
  const [reassignRoomNumber, setReassignRoomNumber] = useState<string | null>(null);

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
      width: 180,
      flex: 1,
    },
    {
      field: 'authorityName',
      headerName: 'Authority',
      width: 150,
    },
    {
      field: 'serviceAssignment',
      headerName: 'Service & Room',
      width: 200,
      renderCell: (params) => {
        if (params.row.serviceName && params.row.roomNumber) {
          return (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {params.row.serviceName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.roomNumber}
              </Typography>
            </Box>
          );
        }
        return (
          <Chip
            label="Not Assigned"
            color="warning"
            size="small"
          />
        );
      },
    },
    {
      field: 'sharedRate',
      headerName: 'Shared Rate',
      width: 120,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'sharedHoursPerWeek',
      headerName: 'Shared h/wk',
      width: 120,
    },
    {
      field: 'oneToOneRate',
      headerName: '1:1 Rate',
      width: 110,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'oneToOneHoursPerWeek',
      headerName: '1:1 h/wk',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
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
      width: 120,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit Contract">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit contract:', params.row.id);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign/Change Service">
            <IconButton
              size="small"
              color={params.row.serviceId ? 'primary' : 'warning'}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenReassign(params.row);
              }}
            >
              <HomeWorkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleOpenDialog = () => {
    reset();
    setCreateStep('basic');
    setTempContractData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreateStep('basic');
    setTempContractData({});
    reset();
  };

  const handleBasicInfoNext = (data: ContractFormData) => {
    setTempContractData({
      ...data,
      authorityName: data.authorityId === 'auth-1' ? 'City Council' : 'County Social Services',
    });
    setCreateStep('service');
  };

  const handleServiceAssignmentNext = () => {
    setCreateStep('rates');
  };

  const handleFinalSubmit = async (rateData: ContractFormData) => {
    try {
      const finalData = {
        ...tempContractData,
        sharedRate: rateData.sharedRate,
        oneToOneRate: rateData.oneToOneRate,
      };
      
      await createContract.mutateAsync(finalData);
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create contract:', error);
    }
  };

  // Reassignment functions
  const handleOpenReassign = (contract: any) => {
    setSelectedContractForReassign(contract);
    setReassignServiceId(contract.serviceId || null);
    setReassignRoomNumber(contract.roomNumber || null);
    setOpenReassignDialog(true);
  };

  const handleCloseReassign = () => {
    setOpenReassignDialog(false);
    setSelectedContractForReassign(null);
    setReassignServiceId(null);
    setReassignRoomNumber(null);
  };

  const handleConfirmReassignment = async () => {
    if (!selectedContractForReassign || !reassignServiceId || !reassignRoomNumber) return;

    try {
      await updateContract.mutateAsync({
        id: selectedContractForReassign.id,
        data: {
          serviceId: reassignServiceId,
          roomNumber: reassignRoomNumber,
          // serviceName will be set by the mock API
        },
      });
      handleCloseReassign();
    } catch (error) {
      console.error('Failed to reassign service:', error);
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

      {/* Create Contract Dialog - Multi-Step */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {createStep === 'basic' && 'Create New Contract - Step 1 of 3'}
          {createStep === 'service' && 'Create New Contract - Step 2 of 3'}
          {createStep === 'rates' && 'Create New Contract - Step 3 of 3'}
        </DialogTitle>

        <DialogContent>
          {createStep === 'basic' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                select
                label="Authority"
                {...register('authorityId')}
                error={!!errors.authorityId}
                helperText={errors.authorityId?.message}
                fullWidth
              >
                <MenuItem value="">
                  <em>Select an authority...</em>
                </MenuItem>
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

              <TextField
                label="Shared Hours per Week"
                type="number"
                {...register('sharedHoursPerWeek', { valueAsNumber: true })}
                error={!!errors.sharedHoursPerWeek}
                helperText={errors.sharedHoursPerWeek?.message}
                inputProps={{ step: 0.5, min: 0 }}
                fullWidth
              />

              <TextField
                label="1:1 Hours per Week"
                type="number"
                {...register('oneToOneHoursPerWeek', { valueAsNumber: true })}
                error={!!errors.oneToOneHoursPerWeek}
                helperText={errors.oneToOneHoursPerWeek?.message}
                inputProps={{ step: 0.5, min: 0 }}
                fullWidth
              />
            </Box>
          )}

          {createStep === 'service' && (
            <ServiceAssignmentStep
              contractData={{
                sharedHours: tempContractData.sharedHoursPerWeek || 0,
                oneToOneHours: tempContractData.oneToOneHoursPerWeek || 0,
                regionId: 'region-1',
                authorityId: tempContractData.authorityId || '',
              }}
              selectedServiceId={tempContractData.serviceId || null}
              selectedRoomNumber={tempContractData.roomNumber || null}
              onServiceSelect={(serviceId) => {
                setTempContractData({ 
                  ...tempContractData, 
                  serviceId,
                  roomNumber: null,
                });
              }}
              onRoomSelect={(roomNumber) =>
                setTempContractData({ ...tempContractData, roomNumber })
              }
              onNext={handleServiceAssignmentNext}
              onBack={() => setCreateStep('basic')}
            />
          )}

          {createStep === 'rates' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Service User:</strong> {tempContractData.serviceUserName}
                </Typography>
                <Typography variant="body2">
                  <strong>Service:</strong> {tempContractData.serviceName || 'Selected'}
                </Typography>
                <Typography variant="body2">
                  <strong>Room:</strong> {tempContractData.roomNumber}
                </Typography>
                <Typography variant="body2">
                  <strong>Hours:</strong> {tempContractData.sharedHoursPerWeek}h Shared, {tempContractData.oneToOneHoursPerWeek}h 1:1
                </Typography>
              </Alert>

              <TextField
                label="Shared Rate (£/hour)"
                type="number"
                {...register('sharedRate', { valueAsNumber: true })}
                error={!!errors.sharedRate}
                helperText={errors.sharedRate?.message}
                inputProps={{ step: 0.01, min: 0 }}
                fullWidth
              />

              <TextField
                label="1:1 Rate (£/hour)"
                type="number"
                {...register('oneToOneRate', { valueAsNumber: true })}
                error={!!errors.oneToOneRate}
                helperText={errors.oneToOneRate?.message}
                inputProps={{ step: 0.01, min: 0 }}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          
          {createStep === 'basic' && (
            <Button 
              onClick={handleSubmit(handleBasicInfoNext)} 
              variant="contained"
            >
              Next: Assign Service
            </Button>
          )}

          {createStep === 'service' && (
            <Button onClick={() => setCreateStep('basic')}>
              Back
            </Button>
          )}

          {createStep === 'rates' && (
            <>
              <Button onClick={() => setCreateStep('service')}>
                Back
              </Button>
              <Button
                onClick={handleSubmit(handleFinalSubmit)}
                variant="contained"
                disabled={createContract.isPending}
              >
                {createContract.isPending ? 'Creating...' : 'Create Contract'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Reassign Service Dialog */}
      <Dialog open={openReassignDialog} onClose={handleCloseReassign} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedContractForReassign?.serviceId ? 'Change Service Assignment' : 'Assign Service'}
        </DialogTitle>
        <DialogContent>
          {selectedContractForReassign && (
            <>
              <Alert severity="info" sx={{ mb: 3, mt: 1 }}>
                <Typography variant="body2">
                  <strong>Service User:</strong> {selectedContractForReassign.serviceUserName}
                </Typography>
                <Typography variant="body2">
                  <strong>Hours:</strong> {selectedContractForReassign.sharedHoursPerWeek}h Shared,{' '}
                  {selectedContractForReassign.oneToOneHoursPerWeek}h 1:1
                </Typography>
                {selectedContractForReassign.serviceName && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Current Assignment:</strong> {selectedContractForReassign.serviceName} -{' '}
                    {selectedContractForReassign.roomNumber}
                  </Typography>
                )}
              </Alert>

              <ServiceAssignmentStep
                contractData={{
                  sharedHours: selectedContractForReassign.sharedHoursPerWeek || 0,
                  oneToOneHours: selectedContractForReassign.oneToOneHoursPerWeek || 0,
                  regionId: selectedContractForReassign.regionId || 'region-1',
                  authorityId: selectedContractForReassign.authorityId || '',
                }}
                selectedServiceId={reassignServiceId}
                selectedRoomNumber={reassignRoomNumber}
                onServiceSelect={(serviceId) => {
                  setReassignServiceId(serviceId);
                  setReassignRoomNumber(null);
                }}
                onRoomSelect={(roomNumber) => setReassignRoomNumber(roomNumber)}
                onNext={handleConfirmReassignment}
                onBack={handleCloseReassign}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
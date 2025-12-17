import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { usePayments, useAllocationSuggestion, useConfirmAllocation } from '@/hooks/usePayments';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { AllocationSuggestion } from '@/lib/types/payment';

export default function PaymentsPage() {
  const { data: payments, isLoading } = usePayments();
  const confirmAllocation = useConfirmAllocation();
  
  const [openAllocationDialog, setOpenAllocationDialog] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<Record<string, number>>({});

  const { data: suggestions } = useAllocationSuggestion(
    selectedPaymentId || '',
    openAllocationDialog && !!selectedPaymentId
  );

  const columns: GridColDef[] = [
    {
      field: 'referenceNumber',
      headerName: 'Reference',
      width: 150,
    },
    {
      field: 'authorityName',
      headerName: 'Authority',
      width: 200,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 130,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'dateReceived',
      headerName: 'Date Received',
      width: 150,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'periodLabel',
      headerName: 'Period',
      width: 200,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value === 'allocated' ? 'Allocated' : 'Pending'}
          color={params.value === 'allocated' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<AssignmentIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenAllocation(params.row.id);
          }}
          disabled={params.row.status === 'allocated'}
        >
          Allocate
        </Button>
      ),
    },
  ];

  const handleOpenAllocation = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setOpenAllocationDialog(true);
  };

  const handleCloseAllocation = () => {
    setOpenAllocationDialog(false);
    setSelectedPaymentId(null);
    setAllocations({});
  };

  const handleAllocationChange = (contractId: string, amount: string) => {
    setAllocations(prev => ({
      ...prev,
      [contractId]: parseFloat(amount) || 0,
    }));
  };

  const handleUseSuggested = () => {
    if (suggestions) {
      const suggested = suggestions.reduce((acc, s) => ({
        ...acc,
        [s.contractId]: s.suggestedAmount,
      }), {});
      setAllocations(suggested);
    }
  };

  const handleConfirmAllocation = async () => {
    if (!selectedPaymentId) return;

    try {
      await confirmAllocation.mutateAsync({
        paymentId: selectedPaymentId,
        allocations,
      });
      handleCloseAllocation();
    } catch (error) {
      console.error('Failed to confirm allocation:', error);
    }
  };

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const selectedPayment = payments?.find(p => p.id === selectedPaymentId);
  const difference = selectedPayment ? selectedPayment.amount - totalAllocated : 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Create payment - TODO')}
        >
          Record Payment
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={payments || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          sx={{
            bgcolor: 'background.paper',
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Allocation Dialog */}
      <Dialog 
        open={openAllocationDialog} 
        onClose={handleCloseAllocation}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Allocate Payment
          {selectedPayment && (
            <Typography variant="body2" color="text.secondary">
              {selectedPayment.authorityName} - {formatCurrency(selectedPayment.amount)}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {suggestions && suggestions.length > 0 ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleUseSuggested}
                >
                  Use Suggested Allocation
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Contract</TableCell>
                      <TableCell align="right">Expected</TableCell>
                      <TableCell align="right">Suggested</TableCell>
                      <TableCell align="right">Variance</TableCell>
                      <TableCell align="right">Allocate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {suggestions.map((suggestion: AllocationSuggestion) => (
                      <TableRow key={suggestion.contractId}>
                        <TableCell>{suggestion.contractName}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(suggestion.expectedAmount)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(suggestion.suggestedAmount)}
                        </TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            color: suggestion.variance > 0 ? 'success.main' : 
                                   suggestion.variance < 0 ? 'error.main' : 'inherit'
                          }}
                        >
                          {formatCurrency(suggestion.variance)}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            size="small"
                            value={allocations[suggestion.contractId] || ''}
                            onChange={(e) => handleAllocationChange(suggestion.contractId, e.target.value)}
                            inputProps={{ step: 0.01 }}
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2 }}>
                {difference !== 0 && (
                  <Alert severity={Math.abs(difference) < 0.01 ? 'success' : 'warning'}>
                    <strong>Total Allocated:</strong> {formatCurrency(totalAllocated)}
                    <br />
                    <strong>Payment Amount:</strong> {formatCurrency(selectedPayment?.amount || 0)}
                    <br />
                    <strong>Difference:</strong> {formatCurrency(difference)}
                  </Alert>
                )}
              </Box>
            </>
          ) : (
            <Typography>No active contracts found for this authority.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllocation}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmAllocation}
            disabled={
              confirmAllocation.isPending ||
              !suggestions ||
              suggestions.length === 0 ||
              Math.abs(difference) > 0.01
            }
          >
            {confirmAllocation.isPending ? 'Confirming...' : 'Confirm Allocation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
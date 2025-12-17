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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useInvoices, useInvoiceDetails, useFinalizeInvoice } from '@/hooks/useInvoices';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useInvoices();
  const finalizeInvoice = useFinalizeInvoice();
  
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const { data: invoiceDetails } = useInvoiceDetails(
    selectedInvoiceId || '',
  );

  const columns: GridColDef[] = [
    {
      field: 'invoiceNumber',
      headerName: 'Invoice #',
      width: 150,
    },
    {
      field: 'contractName',
      headerName: 'Contract',
      width: 200,
      flex: 1,
    },
    {
      field: 'billingPeriodStart',
      headerName: 'Period Start',
      width: 130,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'billingPeriodEnd',
      headerName: 'Period End',
      width: 130,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 130,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'finalized' ? 'Finalized' : 'Draft'}
          color={params.value === 'finalized' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'generatedAt',
      headerName: 'Generated',
      width: 150,
      valueFormatter: (value) => formatDate(value as string),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails(params.row.id);
            }}
          >
            View
          </Button>
          {params.row.status === 'draft' && (
            <Button
              size="small"
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleFinalize(params.row.id);
              }}
            >
              Finalize
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const handleOpenDetails = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    setSelectedInvoiceId(null);
  };

  const handleFinalize = async (invoiceId: string) => {
    if (window.confirm('Are you sure you want to finalize this invoice? This cannot be undone.')) {
      try {
        await finalizeInvoice.mutateAsync(invoiceId);
      } catch (error) {
        console.error('Failed to finalize invoice:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Invoices</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log('Generate invoice - TODO')}
        >
          Generate Invoice
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={invoices || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: {
              sortModel: [{ field: 'generatedAt', sort: 'desc' }],
            },
          }}
          sx={{
            bgcolor: 'background.paper',
          }}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Invoice Details Dialog */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Invoice Details
          {invoiceDetails && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                {invoiceDetails.invoiceNumber}
              </Typography>
              <Chip
                label={invoiceDetails.status}
                color={invoiceDetails.status === 'finalized' ? 'success' : 'default'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {invoiceDetails && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">Contract</Typography>
                <Typography variant="body1">{invoiceDetails.contractName}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">Billing Period</Typography>
                <Typography variant="body1">
                  {formatDate(invoiceDetails.billingPeriodStart)} - {formatDate(invoiceDetails.billingPeriodEnd)}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>Line Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Hours</TableCell>
                      <TableCell align="right">Rate</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoiceDetails.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">
                          {item.hours !== undefined ? item.hours : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {item.rate !== undefined ? formatCurrency(item.rate) : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatCurrency(invoiceDetails.totalAmount)}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Generated: {formatDate(invoiceDetails.generatedAt)}
                </Typography>
                {invoiceDetails.finalizedAt && (
                  <>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Finalized: {formatDate(invoiceDetails.finalizedAt)}
                    </Typography>
                  </>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          {invoiceDetails && invoiceDetails.status === 'draft' && (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                handleFinalize(invoiceDetails.id);
                handleCloseDetails();
              }}
            >
              Finalize Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
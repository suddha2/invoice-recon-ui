import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import { useContracts } from '@/hooks/useContracts';
import { useInvoices } from '@/hooks/useInvoices';
import { usePayments } from '@/hooks/usePayments';
import { formatCurrency } from '@/lib/utils/formatting';

export default function ReconciliationPage() {
  const { data: contracts } = useContracts();
  const { data: invoices } = useInvoices();
  const { data: payments } = usePayments();

  const [selectedAuthority, setSelectedAuthority] = useState<string>('all');

  // Get unique authorities
  const authorities = Array.from(
    new Set(contracts?.map(c => c.authorityId) || [])
  ).map(id => {
    const contract = contracts?.find(c => c.authorityId === id);
    return { id, name: contract?.authorityName || '' };
  });

  // Filter data by authority
  const filteredContracts = selectedAuthority === 'all'
    ? contracts
    : contracts?.filter(c => c.authorityId === selectedAuthority);

  const filteredInvoices = selectedAuthority === 'all'
    ? invoices
    : invoices?.filter(inv => {
        const contract = contracts?.find(c => c.id === inv.contractId);
        return contract?.authorityId === selectedAuthority;
      });

  const filteredPayments = selectedAuthority === 'all'
    ? payments
    : payments?.filter(p => p.authorityId === selectedAuthority);

  // Calculate totals
  const totalExpected = filteredContracts?.reduce((sum, contract) => {
    if (contract.status !== 'active') return sum;
    const monthly = (
      contract.sharedHoursPerWeek * 4 * contract.sharedRate +
      contract.oneToOneHoursPerWeek * 4 * contract.oneToOneRate
    );
    return sum + monthly;
  }, 0) || 0;

  const totalInvoiced = filteredInvoices?.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;
  const totalReceived = filteredPayments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  const varianceInvoiced = totalInvoiced - totalExpected;
  const varianceReceived = totalReceived - totalInvoiced;

  // Breakdown by contract
  const reconciliationData = filteredContracts?.map(contract => {
    const contractInvoices = filteredInvoices?.filter(inv => inv.contractId === contract.id) || [];
    const invoicedAmount = contractInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    const expectedMonthly = (
      contract.sharedHoursPerWeek * 4 * contract.sharedRate +
      contract.oneToOneHoursPerWeek * 4 * contract.oneToOneRate
    );

    return {
      contractId: contract.id,
      serviceUserName: contract.serviceUserName,
      authorityName: contract.authorityName,
      expected: expectedMonthly,
      invoiced: invoicedAmount,
      variance: invoicedAmount - expectedMonthly,
      status: contract.status,
    };
  }) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Reconciliation</Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Authority</InputLabel>
          <Select
            value={selectedAuthority}
            label="Authority"
            onChange={(e) => setSelectedAuthority(e.target.value)}
          >
            <MenuItem value="all">All Authorities</MenuItem>
            {authorities.map(auth => (
              <MenuItem key={auth.id} value={auth.id}>
                {auth.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Expected (Contracted)
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalExpected)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Based on active contracts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Invoiced
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalInvoiced)}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: varianceInvoiced >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {varianceInvoiced >= 0 ? '+' : ''}{formatCurrency(varianceInvoiced)} variance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Received
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalReceived)}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: varianceReceived >= 0 ? 'success.main' : 'error.main' 
                }}
              >
                {varianceReceived >= 0 ? '+' : ''}{formatCurrency(varianceReceived)} vs invoiced
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Outstanding
              </Typography>
              <Typography variant="h4">
                {formatCurrency(totalInvoiced - totalReceived)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Awaiting payment
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contract-Level Reconciliation
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Contract</TableCell>
                  <TableCell>Authority</TableCell>
                  <TableCell align="right">Expected</TableCell>
                  <TableCell align="right">Invoiced</TableCell>
                  <TableCell align="right">Variance</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reconciliationData.map((row) => (
                  <TableRow key={row.contractId}>
                    <TableCell>{row.serviceUserName}</TableCell>
                    <TableCell>{row.authorityName}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.expected)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(row.invoiced)}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{
                        color: Math.abs(row.variance) < 1 ? 'inherit' :
                               row.variance > 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {row.variance >= 0 ? '+' : ''}{formatCurrency(row.variance)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={row.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {reconciliationData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No contracts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
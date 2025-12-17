import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useContracts } from '@/hooks/useContracts';
import { usePayments } from '@/hooks/usePayments';
import { useInvoices } from '@/hooks/useInvoices';

export default function Dashboard() {
  const { data: contracts } = useContracts();
  const { data: payments } = usePayments();
  const { data: invoices } = useInvoices();

  const activeContracts = contracts?.filter(c => c.status === 'active').length || 0;
  const pendingPayments = payments?.filter(p => p.status === 'pending_allocation').length || 0;
  const draftInvoices = invoices?.filter(i => i.status === 'draft').length || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Contracts
              </Typography>
              <Typography variant="h3">
                {activeContracts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Payments
              </Typography>
              <Typography variant="h3">
                {pendingPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Draft Invoices
              </Typography>
              <Typography variant="h3">
                {draftInvoices}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Contracts
              </Typography>
              <Typography variant="h3">
                {contracts?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useServiceUtilization, useStackingAnalysis } from '@/hooks/useServices';
import { formatCurrency } from '@/lib/utils/formatting';

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: utilization, isLoading } = useServiceUtilization(id!);
  const [showStacking, setShowStacking] = useState(false);
  const { data: stackingAnalysis } = useStackingAnalysis(showStacking ? id! : null);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (!utilization) {
    return <Typography>Service not found</Typography>;
  }

  const efficiencyColor =
    utilization.efficiencyRating === 'high'
      ? 'success'
      : utilization.efficiencyRating === 'medium'
      ? 'warning'
      : 'error';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/services')}>
            Back
          </Button>
          <Typography variant="h4">{utilization.serviceName}</Typography>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/services/${id}/edit`)}>
          Edit Service
        </Button>
      </Box>

      {/* Service Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Address
        </Typography>
        <Typography variant="body1" gutterBottom>
          {utilization.address}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          Region
        </Typography>
        <Typography variant="body1" gutterBottom>
          {utilization.regionName}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          Capacity
        </Typography>
        <Typography variant="body1" gutterBottom>
          {utilization.totalRooms} rooms
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          Occupancy
        </Typography>
        <Typography variant="body1">
          {utilization.occupancyRate.toFixed(0)}% ({utilization.occupiedRooms} of{' '}
          {utilization.totalRooms} rooms)
        </Typography>
      </Paper>

      {/* Utilization Metrics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Utilization Metrics
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Shared Hours
                </Typography>
                <Typography variant="h5">{utilization.totalSharedHours}h/week</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  1:1 Hours
                </Typography>
                <Typography variant="h5">{utilization.totalOneToOneHours}h/week</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Efficiency Rating
                </Typography>
                <Chip
                  label={utilization.efficiencyRating.toUpperCase()}
                  color={efficiencyColor}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Est. Weekly Cost
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(utilization.estimatedWeeklyCost)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Current Residents */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Residents
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Service User</TableCell>
                <TableCell align="right">Shared Hours</TableCell>
                <TableCell align="right">1:1 Hours</TableCell>
                <TableCell align="right">2:1 Hours</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {utilization.residents.map((resident) => (
                <TableRow key={resident.contractId}>
                  <TableCell>{resident.roomNumber}</TableCell>
                  <TableCell>{resident.serviceUserName}</TableCell>
                  <TableCell align="right">{resident.sharedHours}h</TableCell>
                  <TableCell align="right">{resident.oneToOneHours}h</TableCell>
                  <TableCell align="right">{resident.twoToOneHours || 0}h</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                </TableRow>
              ))}
              {Array.from({ length: utilization.vacantRooms }, (_, i) => (
                <TableRow key={`vacant-${i}`}>
                  <TableCell>
                    {id === 'service-3'
                      ? `Unit ${String.fromCharCode(65 + utilization.occupiedRooms + i)}`
                      : `Room ${utilization.occupiedRooms + i + 1}`}
                  </TableCell>
                  <TableCell>
                    <em>[Vacant]</em>
                  </TableCell>
                  <TableCell align="right">-</TableCell>
                  <TableCell align="right">-</TableCell>
                  <TableCell align="right">-</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Hour Stacking Analysis */}
      {utilization.occupiedRooms > 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Hour Stacking Analysis</Typography>
            <FormControlLabel
              control={<Switch checked={showStacking} onChange={(e) => setShowStacking(e.target.checked)} />}
              label="Show Analysis"
            />
          </Box>

          {showStacking && stackingAnalysis && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                This analysis shows potential savings by having shared staff cover multiple residents
                simultaneously when they are in the same location.
              </Alert>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Current Model (No Stacking)
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Each resident has separate shared staff
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        Staff Hours: {stackingAnalysis.currentStaffHours}h/week
                      </Typography>
                      <Typography variant="body2">
                        Weekly Cost: {formatCurrency(stackingAnalysis.currentWeeklyCost)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ bgcolor: 'success.50' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="success.main" gutterBottom>
                        With Stacking (Optimized)
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Same staff covers multiple residents
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        Staff Hours: {stackingAnalysis.stackedStaffHours}h/week
                      </Typography>
                      <Typography variant="body2">
                        Weekly Cost: {formatCurrency(stackingAnalysis.stackedWeeklyCost)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Potential Savings:
                </Typography>
                <Typography variant="body2">
                  • Hours Saved: {stackingAnalysis.hoursSaved.toFixed(1)}h/week (
                  {((stackingAnalysis.hoursSaved / stackingAnalysis.currentStaffHours) * 100).toFixed(0)}%
                  reduction)
                </Typography>
                <Typography variant="body2">
                  • Weekly Savings: {formatCurrency(stackingAnalysis.weeklySavings)}
                </Typography>
                <Typography variant="body2">
                  • Annual Savings: {formatCurrency(stackingAnalysis.annualSavings)}
                </Typography>
              </Alert>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}
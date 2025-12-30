import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAllServiceUtilizations } from '@/hooks/useServices';
import { formatCurrency } from '@/lib/utils/formatting';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { data: utilizations, isLoading } = useAllServiceUtilizations();

  const totalServices = utilizations?.length || 0;
  const avgOccupancy =
    utilizations && utilizations.length > 0
      ? utilizations.reduce((sum, u) => sum + u.occupancyRate, 0) / utilizations.length
      : 0;
  const underutilized = utilizations?.filter(u => u.efficiencyRating === 'low').length || 0;
  const highlyEfficient = utilizations?.filter(u => u.efficiencyRating === 'high').length || 0;

  const columns: GridColDef[] = [
    {
      field: 'serviceName',
      headerName: 'Service',
      width: 200,
      flex: 1,
    },
    {
      field: 'regionName',
      headerName: 'Region',
      width: 120,
    },
    {
      field: 'occupancy',
      headerName: 'Rooms',
      width: 100,
      renderCell: (params) => (
        <Box>
          {params.row.occupiedRooms}/{params.row.totalRooms}
        </Box>
      ),
    },
    {
      field: 'occupancyRate',
      headerName: 'Occupancy',
      width: 120,
      renderCell: (params) => `${params.value.toFixed(0)}%`,
    },
    {
      field: 'totalSharedHours',
      headerName: 'Shared Hours',
      width: 130,
      renderCell: (params) => `${params.value}h`,
    },
    {
      field: 'efficiencyRating',
      headerName: 'Efficiency',
      width: 130,
      renderCell: (params) => {
        const rating = params.value as string;
        const color = rating === 'high' ? 'success' : rating === 'medium' ? 'warning' : 'error';
        const stars = rating === 'high' ? '⭐⭐⭐' : rating === 'medium' ? '⭐⭐' : '⭐';
        
        return (
          <Chip
            label={stars}
            color={color}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => navigate(`/services/${params.row.serviceId}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/services/new')}
        >
          Add Service
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Services
              </Typography>
              <Typography variant="h3">{totalServices}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Avg Occupancy
              </Typography>
              <Typography variant="h3">{avgOccupancy.toFixed(0)}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Underutilized
              </Typography>
              <Typography variant="h3" color={underutilized > 0 ? 'error.main' : 'inherit'}>
                {underutilized}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Highly Efficient
              </Typography>
              <Typography variant="h3" color="success.main">
                {highlyEfficient}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {underutilized > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {underutilized} service{underutilized > 1 ? 's are' : ' is'} underutilized. Consider
          consolidating residents for better efficiency.
        </Alert>
      )}

      {/* Services Table */}
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={utilizations || []}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.serviceId}
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
    </Box>
  );
}
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Checkbox, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RateChangeWorkflow } from '@/lib/types/rateChange';
import { useContracts } from '@/hooks/useContracts';
import { formatCurrency } from '@/lib/utils/formatting';

interface Props {
  workflow: RateChangeWorkflow;
  authorityId: string;
  lotName: string;
  selectedContractIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3SelectContracts({
  workflow,
  authorityId,
  lotName,
  selectedContractIds,
  onSelectionChange,
  onNext,
  onBack,
}: Props) {
  const { data: allContracts } = useContracts();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contracts based on workflow
  const availableContracts = allContracts?.filter((c) => {
    if (c.status !== 'active') return false;
    
    if (workflow === 'authority') {
      return c.authorityId === authorityId;
    }
    if (workflow === 'lot') {
      return c.authorityId === authorityId && c.lotName === lotName;
    }
    if (workflow === 'individual') {
      return true; // Show all for search
    }
    return false;
  }) || [];

  // Filter by search term
  const filteredContracts = availableContracts.filter((c) =>
    c.serviceUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select all on mount for authority/lot workflows
  useEffect(() => {
    if ((workflow === 'authority' || workflow === 'lot') && selectedContractIds.length === 0) {
      onSelectionChange(availableContracts.map((c) => c.id));
    }
  }, [workflow, availableContracts.length]);

  const handleSelectAll = () => {
    onSelectionChange(filteredContracts.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const columns: GridColDef[] = [
    {
      field: 'serviceUserName',
      headerName: 'Service User',
      width: 200,
      flex: 1,
    },
    {
      field: 'regionName',
      headerName: 'Region',
      width: 120,
    },
    {
      field: 'lotName',
      headerName: 'Lot',
      width: 100,
    },
    {
      field: 'sharedRate',
      headerName: 'Shared Rate',
      width: 120,
      valueFormatter: (value) => formatCurrency(value as number),
    },
    {
      field: 'oneToOneRate',
      headerName: '1:1 Rate',
      width: 120,
      valueFormatter: (value) => formatCurrency(value as number),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Select Contracts to Update
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {workflow === 'authority' && `Authority: ${availableContracts[0]?.authorityName || ''}`}
          {workflow === 'lot' && `Authority: ${availableContracts[0]?.authorityName || ''}, Lot: ${lotName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {availableContracts.length} contracts found
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button size="small" variant="outlined" onClick={handleSelectAll}>
          Select All ({filteredContracts.length})
        </Button>
        <Button size="small" variant="outlined" onClick={handleDeselectAll}>
          Deselect All
        </Button>
        <TextField
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ ml: 'auto', width: 250 }}
        />
      </Box>

      <Box sx={{ height: 400, mb: 3 }}>
        <DataGrid
          rows={filteredContracts}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedContractIds}
          onRowSelectionModelChange={(newSelection) => {
            onSelectionChange(newSelection as string[]);
          }}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Box>

      <Typography variant="body2" sx={{ mb: 3 }}>
        Selected: {selectedContractIds.length} of {availableContracts.length} contracts
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={selectedContractIds.length === 0}
        >
          Next: Enter New Rates
        </Button>
      </Box>
    </Box>
  );
}
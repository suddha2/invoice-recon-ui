import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Radio,
  Alert,
  Chip,
  MenuItem,
  TextField,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { usePlacementRecommendations } from '@/hooks/useServices';
import { formatCurrency } from '@/lib/utils/formatting';

interface Props {
  contractData: {
    sharedHours: number;
    oneToOneHours: number;
    regionId: string;
    authorityId: string;
  };
  selectedServiceId: string | null;
  selectedRoomNumber: string | null;
  onServiceSelect: (serviceId: string) => void;
  onRoomSelect: (roomNumber: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServiceAssignmentStep({
  contractData,
  selectedServiceId,
  selectedRoomNumber,
  onServiceSelect,
  onRoomSelect,
  onNext,
  onBack,
}: Props) {
  const { data: recommendations, isLoading } = usePlacementRecommendations(contractData);

  const selectedRecommendation = recommendations?.find(r => r.serviceId === selectedServiceId);

  const canProceed = selectedServiceId && selectedRoomNumber;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Assign Service & Room
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Service User will need {contractData.sharedHours}h Shared and {contractData.oneToOneHours}h 1:1
        support per week
      </Typography>

      {isLoading ? (
        <Typography>Loading recommendations...</Typography>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Recommended Services (ranked by efficiency):
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {recommendations?.map((rec, index) => (
              <Card
                key={rec.serviceId}
                variant="outlined"
                sx={{
                  border: selectedServiceId === rec.serviceId ? 2 : 1,
                  borderColor: selectedServiceId === rec.serviceId ? 'primary.main' : 'divider',
                }}
              >
                <CardActionArea onClick={() => onServiceSelect(rec.serviceId)}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Radio checked={selectedServiceId === rec.serviceId} />

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6">{rec.serviceName}</Typography>
                          {index === 0 && rec.recommendation === 'highly_recommended' && (
                            <Chip
                              icon={<CheckCircleIcon />}
                              label="Best Match"
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {rec.regionName} | {rec.availableRooms} vacant room
                          {rec.availableRooms !== 1 ? 's' : ''}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="body2" gutterBottom>
                          <strong>Current:</strong> {rec.currentOccupancy} residents,{' '}
                          {rec.currentSharedHours}h Shared
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          <strong>With this placement:</strong> {rec.newOccupancy} residents,{' '}
                          {rec.newSharedHours}h Shared
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Typography variant="body2" gutterBottom>
                          <strong>Efficiency Score:</strong> {rec.efficiencyScore}/100
                        </Typography>
                        {rec.estimatedAnnualSavings > 0 && (
                          <Typography variant="body2" color="success.main" gutterBottom>
                            <strong>Est. Annual Savings:</strong>{' '}
                            {formatCurrency(rec.estimatedAnnualSavings)}
                          </Typography>
                        )}

                        <Alert severity="info" sx={{ mt: 1.5 }}>
                          {rec.reasoning}
                        </Alert>

                        {selectedServiceId === rec.serviceId && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Select Room:
                            </Typography>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              value={selectedRoomNumber || ''}
                              onChange={(e) => onRoomSelect(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MenuItem value="">
                                <em>Select a room</em>
                              </MenuItem>
                              {rec.vacantRoomNumbers.map((room) => (
                                <MenuItem key={room} value={room}>
                                  {room}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          {recommendations && recommendations.length === 0 && (
            <Alert severity="warning">
              No services with available capacity found. Please create a new service or expand existing
              capacity.
            </Alert>
          )}

          <Button variant="text" onClick={() => window.open('/services/new', '_blank')}>
            + Create New Service
          </Button>
        </>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 4 }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={onNext} disabled={!canProceed}>
          Next: Enter Rates
        </Button>
      </Box>
    </Box>
  );
}
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Weight } from '@repo/graphql/codegen/API';
import { useDeleteWeightMutation } from './lib/api';

interface WeightsTableProps {
  weights: Weight[];
  onEdit?: (weight: Weight) => void;
  onDelete?: (weightId: string) => void;
}

const WeightsTable = ({ weights, onEdit, onDelete }: WeightsTableProps) => {
  const deleteWeightMutation = useDeleteWeightMutation();

  const handleDelete = async (weight: Weight) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      try {
        await deleteWeightMutation.mutateAsync({
          weightId: weight.id,
          userId: weight.userId,
        });
        onDelete?.(weight.id);
      } catch (error) {
        console.error('Failed to delete weight:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!weights || weights.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 3 }}
      >
        No weight entries found
      </Typography>
    );
  }

  // Sort weights by date (newest first)
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Date
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight="bold">
                Weight (kg)
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight="bold">
                Recorded
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="subtitle2" fontWeight="bold">
                Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedWeights.map((weight, index) => {
            const isLatest = index === 0;
            const previousWeight =
              index < sortedWeights.length - 1
                ? sortedWeights[index + 1]
                : null;
            const weightDiff = previousWeight
              ? weight.weight - previousWeight.weight
              : null;

            return (
              <TableRow key={weight.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {formatDate(weight.date)}
                    </Typography>
                    {isLatest && (
                      <Chip
                        label="Latest"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {weight.weight} kg
                    </Typography>
                    {weightDiff !== null && (
                      <Typography
                        variant="caption"
                        color={
                          weightDiff > 0
                            ? 'error.main'
                            : weightDiff < 0
                              ? 'success.main'
                              : 'text.secondary'
                        }
                        sx={{ fontSize: '0.75rem' }}
                      >
                        ({weightDiff > 0 ? '+' : ''}
                        {weightDiff.toFixed(1)})
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(weight.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => onEdit?.(weight)}
                      color="primary"
                      title="Edit weight"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(weight)}
                      color="error"
                      disabled={deleteWeightMutation.isPending}
                      title="Delete weight"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeightsTable;

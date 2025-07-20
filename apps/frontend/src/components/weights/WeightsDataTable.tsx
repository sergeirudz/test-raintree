import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import type {
  GridColDef,
  GridRowId,
  GridEventListener,
  GridRowModel,
  GridRowModesModel,
} from '@mui/x-data-grid';
import type { Weight } from '@repo/graphql/codegen/API';
import { useDeleteWeightMutation, useUpdateWeightMutation } from './lib/api';

interface WeightsDataTableProps {
  weights: Weight[];
}

const WeightsDataTable = ({ weights }: WeightsDataTableProps) => {
  const deleteWeightMutation = useDeleteWeightMutation();
  const updateWeightMutation = useUpdateWeightMutation();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleDeleteClick = (id: GridRowId) => async () => {
    const weight = weights.find((w) => w.id === id);
    if (!weight) return;

    try {
      await deleteWeightMutation.mutateAsync({
        weightId: weight.id,
        userId: weight.userId,
      });
    } catch (error) {
      console.error('Failed to delete weight:', error);
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const originalWeight = weights.find((w) => w.id === newRow.id);
    if (!originalWeight) return newRow;

    if (originalWeight.weight !== newRow.weight) {
      try {
        const updatedWeight = await updateWeightMutation.mutateAsync({
          id: originalWeight.id,
          weight: newRow.weight,
          date: originalWeight.date,
        });
        return { ...newRow, ...updatedWeight };
      } catch (error) {
        console.error('Failed to update weight:', error);
        return { ...newRow, weight: originalWeight.weight };
      }
    }

    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rowsWithDiff = useMemo(() => {
    const sortedWeights = [...weights].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sortedWeights.map((weight, index) => {
      const previousWeight =
        index < sortedWeights.length - 1 ? sortedWeights[index + 1] : null;
      const weightDiff = previousWeight
        ? weight.weight - previousWeight.weight
        : null;

      return {
        ...weight,
        weightDiff,
      };
    });
  }, [weights]);

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => formatDate(params.value as string),
    },
    {
      field: 'weight',
      headerName: 'Weight (kg)',
      width: 120,
      type: 'number',
      editable: true,
      renderCell: (params) => {
        const row = params.row;
        const isInEditMode = rowModesModel[row.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return null;
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{row.weight} kg</span>
          </Box>
        );
      },
    },
    {
      field: 'weightDiff',
      headerName: 'Change',
      width: 100,
      renderCell: (params) => {
        const row = params.row;
        const weightDiff = row.weightDiff;

        if (weightDiff === null) return null;

        return (
          <span
            style={{
              fontSize: '0.875rem',
              color:
                weightDiff > 0
                  ? '#d32f2f'
                  : weightDiff < 0
                    ? '#2e7d32'
                    : '#757575',
            }}
          >
            ({weightDiff > 0 ? '+' : ''}
            {weightDiff.toFixed(1)})
          </span>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Recorded',
      width: 180,
      renderCell: (params) => formatDateTime(params.value as string),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={
                <Tooltip title="Save">
                  <SaveIcon color="primary" />
                </Tooltip>
              }
              label="Save"
              onClick={handleSaveClick(id)}
              disabled={updateWeightMutation.isPending}
            />,
            <GridActionsCellItem
              icon={
                <Tooltip title="Cancel">
                  <CancelIcon />
                </Tooltip>
              }
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={
              <Tooltip title="Edit weight">
                <EditIcon />
              </Tooltip>
            }
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Delete weight">
                <DeleteIcon />
              </Tooltip>
            }
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            disabled={deleteWeightMutation.isPending}
          />,
        ];
      },
    },
  ];

  if (!weights || weights.length === 0) {
    return (
      <Box
        sx={{
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        No weight entries found
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rowsWithDiff}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: 'date', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          border: 1,
          borderColor: 'divider',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </Box>
  );
};

export default WeightsDataTable;

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import type {
  GridRowsProp,
  GridRowModesModel,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridSlotProps,
} from '@mui/x-data-grid';
import {
  useListUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} from './lib/api';
import type { User } from '@repo/graphql/codegen/API';
import { useRouter } from '@tanstack/react-router';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }
}

function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = `temp-${Date.now()}`;
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbar>
      <Tooltip title="Add user">
        <button
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <AddIcon fontSize="small" />
          Add User
        </button>
      </Tooltip>
    </GridToolbar>
  );
}

export default function UsersDataTable() {
  const { data: usersData, isLoading, error } = useListUsersQuery();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const createUserMutation = useCreateUserMutation();

  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const router = useRouter();

  useEffect(() => {
    if (usersData?.items) {
      const userRows: GridRowsProp = usersData.items.map((user: User) => ({
        id: user.id,
        name: user.name,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }));
      setRows(userRows);
    }
  }, [usersData]);

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Failed to load users: {error.message}</Alert>
    );
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteUserMutation.mutate({ userId: id as string });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const isNew = newRow.isNew;

    if (isNew) {
      createUserMutation.mutate(
        { name: newRow.name },
        {
          onSuccess: () => {
            setRows(rows.filter((row) => row.id !== newRow.id));
          },
          onError: (error) => {
            console.error('Failed to create user:', error);
            setRowModesModel({
              ...rowModesModel,
              [newRow.id]: { mode: GridRowModes.Edit },
            });
          },
        }
      );
      return newRow;
    } else {
      updateUserMutation.mutate(
        {
          id: newRow.id as string,
          name: newRow.name,
        },
        {
          onError: (error) => {
            console.error('Failed to update user:', error);
            const originalRow = rows.find((row) => row.id === newRow.id);
            return originalRow || newRow;
          },
        }
      );

      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      return updatedRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      type: 'date',
      width: 150,
      editable: false,
      valueFormatter: (value) => {
        return value ? new Date(value).toLocaleDateString() : '';
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      type: 'date',
      width: 150,
      editable: false,
      valueFormatter: (value) => {
        return value ? new Date(value).toLocaleDateString() : '';
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityIcon />}
            label="View"
            onClick={() => {
              router.navigate({ to: `/users/${id}` });
            }}
            color="inherit"
          />,
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

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
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { useUpdateUserMutation } from './lib/api';

const UserNameField = ({
  name = '',
  userId,
}: {
  name: string;
  userId: string;
}) => {
  const [value, setValue] = useState(name);
  const [isNameFocused, setIsNamedFocused] = useState(false);
  const originalValueRef = useRef(name);

  const updateUserMutation = useUpdateUserMutation();

  useEffect(() => {
    if (!isNameFocused) {
      setValue(name);
      originalValueRef.current = name;
    }
  }, [name, isNameFocused]);

  const handleStartEditing = () => {
    originalValueRef.current = name;
    setValue(name);
    setIsNamedFocused(true);
  };

  const handleDiscard = () => {
    setValue(originalValueRef.current);
    setIsNamedFocused(false);
  };

  const handleConfirm = async () => {
    if (value.trim() === '') {
      console.error('Name cannot be empty');
      return;
    }

    if (value === originalValueRef.current) {
      setIsNamedFocused(false);
      return;
    }

    console.log('Updating user name:', { userId, name: value });

    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        name: value.trim(),
      });
      setIsNamedFocused(false);
    } catch (error) {
      // TODO: toast error
      console.error('Failed to update user name:', error);
    }
  };

  return (
    <>
      {!isNameFocused ? (
        <Typography variant="h6" component="h2" onClick={handleStartEditing}>
          {name}
        </Typography>
      ) : (
        <Stack direction="row">
          <TextField
            autoFocus
            value={value}
            variant="standard"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleConfirm();
              } else if (event.key === 'Escape') {
                handleDiscard();
              }
            }}
            sx={{
              p: 0,
              '& .MuiInputBase-input': {
                padding: 0,
                border: 0,
              },
            }}
          />
          <IconButton
            aria-label="Confirm"
            size="small"
            color="success"
            onClick={() => handleConfirm()}
            disabled={updateUserMutation.isPending}
          >
            <SaveIcon />
          </IconButton>
          <IconButton
            aria-label="Discard"
            size="small"
            onClick={handleDiscard}
            disabled={updateUserMutation.isPending}
          >
            <CancelIcon />
          </IconButton>
        </Stack>
      )}
    </>
  );
};
export default UserNameField;

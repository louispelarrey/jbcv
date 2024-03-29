import { Alert, AlertTitle, Box, Button, Grid, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';
import { ManifestationData } from '../../../containers/Manifestation/Edit';
import {useEffect, useState} from "react";

interface ManifestationFormProps {
  initialValues: ManifestationData;
  register: UseFormRegister<ManifestationData>;
  handleSubmit: any;
  error: string;
}

export const ManifestationFormComponent = ({
  initialValues,
  register,
  handleSubmit,
  error
}: ManifestationFormProps) => {

  const [open, setOpen] = useState(false);

  useEffect(() => {
    error !== '' ? setOpen(true) : setOpen(false)
  }, [error]);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  return (
    <Grid container component="main">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>{error}</strong>
        </Alert>
      </Snackbar>
      <Grid item component={Paper} square>
        <Box
          sx={{
            my: 2,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <Typography id="modal-modal-title" variant="h6" component="span">
              Modifier une manifestation
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Titre"
              size='small'
              type="title"
              id="title"
              autoComplete="title"
              {...register('title', { required: true })}
              defaultValue={initialValues.title}
            />
            <TextField
              required
              fullWidth
              label="Description"
              size='small'
              type="description"
              id="description"
              autoComplete="description"
              {...register('description', { required: true })}
              defaultValue={initialValues.description}
            />
            <TextField
              required
              fullWidth
              label="Adresse"
              size='small'
              type="address"
              id="address"
              autoComplete="address"
              {...register('address', { required: true })}
              defaultValue={initialValues.address}
            />
            <TextField
              required
              fullWidth
              label="Date de début"
              size='small'
              type="start_date"
              id="start_date"
              autoComplete="start_date"
              {...register('start_date', { required: true })}
              defaultValue={initialValues.start_date}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Modifier
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ManifestationFormComponent;
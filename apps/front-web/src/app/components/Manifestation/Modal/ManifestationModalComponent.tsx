import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { UseFormRegister } from 'react-hook-form';

export interface ManifestationData {
  title: string;
  description: string;
  address: string;
  start_date: string;
}

interface ManifestationModalProps {
  register: UseFormRegister<ManifestationData>;
  handleSubmit: any;
}

export const ManifestationModalComponent = ({
  handleSubmit,
  register,
}: ManifestationModalProps) => {

  return (
    <Grid container component="main">
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
              Créer une manifestation
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
            />
            <input 
              required
              type="date"
              id="start_date"
              {...register('start_date', { required: true })}
            />
            <TextField
              required
              fullWidth
              label="Addresse"
              size='small'
              type="address"
              id="address"
              autoComplete="address"
              {...register('address', { required: true })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
            >
              Créer
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
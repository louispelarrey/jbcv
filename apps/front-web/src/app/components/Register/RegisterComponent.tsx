import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Typography,
  Link as LinkMUI
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {UseFormRegister} from "react-hook-form";
import {RegisterData} from "../../containers/Register/Register";
import {eventCollect} from "raidalytics";

interface RegisterProps {
  register: UseFormRegister<RegisterData>;
  handleSubmit: any;
  onSubmit: any;
  openError?: boolean;
}

export const RegisterComponent = ({register, handleSubmit, onSubmit, openError}: RegisterProps) => {

  const [open, setOpen] = useState(false);

  const handleFormSubmit = async (data: RegisterData) => {
    await eventCollect('RegistrationButtonClicked', {tag: 'Inscription'});
    onSubmit(data);
  };

  useEffect(() => {
    if (openError === true) {
      setOpen(true);
    }
  }, [openError]);

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
          Un problème est survenu avec votre inscription, veillez à bien remplir tous les champs!
        </Alert>
      </Snackbar>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Inscription
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit(handleFormSubmit)} sx={{mt: 3}}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Pseudonyme"
                {...register("username")}
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Adresse email"
                {...register("email")}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Mot de passe"
                type="password"
                id="password"
                {...register("password")}
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            S'inscrire
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <LinkMUI component={Link} to="/login" variant="body2">
                Vous avez déjà un compte ? Se connecter
              </LinkMUI>
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Container>
  );
}

import { Button, Card, Grid, Modal, Typography } from '@mui/material';
import { TrashData, TrashModalComponent } from '../Modal/TrashModalComponent';
import { CardComponent } from './Card/TrashCardComponent';
import { UseFormRegister } from 'react-hook-form';

interface List {
  id: string;
  reference: string;
  description: string;
  address: string;
  updatedAt: string;
}

interface ITrashListingComponent {
  data: List[];
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  register: UseFormRegister<TrashData>;
  handleSubmit: any;
  onSubmit: any;
}

export const TrashListingComponent = ({
  data,
  open,
  handleOpen,
  handleClose,
  register,
  handleSubmit,
  onSubmit,
}: ITrashListingComponent) => {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          px: 2,
          my: 2,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          overflowY: 'scroll',
        }}
      >
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TrashModalComponent
            handleSubmit={handleSubmit(onSubmit)}
            register={register}
          />
        </Typography>
      </Modal>
      <Grid
        container
        spacing={2}
        sx={{
          px: 2,
          my: 2,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Card sx={{ height: 'fit-content' }}>
          <Button onClick={handleOpen}>Créer une annonce</Button>
        </Card>
        {data.map((item: List) => (
          <CardComponent
            key={item.id}
            title={item.reference}
            description={item.description}
            address={item.address}
            updatedAt={item.updatedAt}
            image={item.fileImageUrl}
            trashId={item.id}
          />
        ))}
      </Grid>
    </>
  );
};

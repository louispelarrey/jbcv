import useGet from '../../hooks/useGet';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TrashListingComponent } from '../../components/Trash/Listing/TrashListingComponent';
import { TrashData } from '../../components/Trash/Modal/TrashModalComponent';

export interface ITrashOnSubmit {
  reference: string;
  description: string;
  address: string;
}

export const Trashs = () => {
  const { data, error, loading } = useGet('/api/trash');
  const [ open, setOpen ] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<TrashData>();

  const onSubmit = async ({ reference, description, address }: TrashData) => {
    const response = await fetch('/api/trash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        reference,
        description,
        address
      }),
    });
    const data = await response.json();
    if (data.id) {
      navigate(`/trash/${data.id}`);
    }
  };

  if (loading) {
    return <div>Chargement ...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return <TrashListingComponent
    data={data}
    open={open}
    handleOpen={handleOpen}
    handleClose={handleClose}
    register={register}
    handleSubmit={handleSubmit}
    onSubmit={onSubmit}
  />;
};

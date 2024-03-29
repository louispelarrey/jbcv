import useGet from '../../hooks/useGet';
import React, {Dispatch, SetStateAction, createContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Data, TrashListingComponent } from '../../components/Trash/Listing/TrashListingComponent';
import { TrashData } from '../../components/Trash/Modal/TrashModalComponent';
import { SuspenseLoader } from '../../suspense/SuspenseLoader';

export const TrashImageContext = createContext({
  trashImage: null as File | null,
  setTrashImage: (() => null) as Dispatch<SetStateAction<File | null>>,
})

export const Trashs = () => {
  const [page, setPage] = useState(1);
  const limit = 9;
  const { data, error, loading } = useGet(`/api/trash/paginated?page=${page}&limit=${limit}`);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<TrashData>();
  const [trashImage, setTrashImage] = useState<File | null>(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const onSubmit = async ({
    reference,
    description,
    address,
  }: TrashData) => {
    const formData = new FormData();

    if (trashImage) formData.append('trashImage', trashImage);
    formData.append(
      'data',
      JSON.stringify({
        reference,
        description,
        latitude,
        longitude,
        address
      })
    );

    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/api/trash`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    const data = await response.json();

    if (response.status === 401) {
      navigate('/logout');
    }
    if (data.id) {
      navigate(`/posting/${data.id}`);
    }
  };

  if (loading) {
    return <SuspenseLoader children={<></>} />;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <TrashImageContext.Provider value={{ trashImage, setTrashImage }}>
      <TrashListingComponent
        data={data as Data | undefined}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        page={page}
        setPage={setPage}
      />
    </TrashImageContext.Provider>
  );
};

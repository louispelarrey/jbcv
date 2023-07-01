import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, Typography, CardMedia, CardContent, CardActions, Collapse, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useGet from '../../hooks/useGet';
import { Chat } from '../Chat/Chat';
import { useChat } from '../../hooks/useChat';


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const usePost = (url: string, body: any) => {
  const [data, setData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return { data, error, loading };
};

export const Manifestation = () => {
  const [expanded, setExpanded] = React.useState(false);
  const { id } = useParams();
  const { data: currentManifestation, error, loading} = useGet(`/api/manifestation/${id}`);
  const { data: myManifestations } = usePost('/api/manifestation/me', {});
  const { messages, userId, scrollTarget, handleSubmit, register, sendMessage } = useChat({
    roomName: 'default',
  });

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  if (loading || !currentManifestation || !myManifestations) {
      return <div>Chargement ...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentIndex = myManifestations.findIndex((manifestation: any) => manifestation.id === id);
  const previousManifestation = currentIndex > 0 ? myManifestations[currentIndex - 1] : null;
  const nextManifestation = currentIndex < myManifestations.length - 1 ? myManifestations[currentIndex + 1] : null

  const handlePreviousManifestation = () => {
    if (previousManifestation) {
      // Rediriger vers la page de la manifestation précédente
      window.location.href = `/manifestation/${previousManifestation.id}`;
    }
  };

  const handleNextManifestation = () => {
    if (nextManifestation) {
      // Rediriger vers la page de la manifestation suivante
      window.location.href = `/manifestation/${nextManifestation.id}`;
    }
  };

  return (
    <div>
      <Card sx={{ width: '100%' }}>
        <CardMedia
          component="img"
          height="194"
          image="https://picsum.photos/200/300"
          alt="Paella dish"
        />
        <CardHeader
          title = {currentManifestation.title}
          subheader = {
            new Date(currentManifestation.start_date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
            })}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {currentManifestation.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: 'center' }}>
          {previousManifestation && (
            <React.Fragment>
              <IconButton aria-label="before" onClick={handlePreviousManifestation}>
                <KeyboardDoubleArrowLeftIcon />
              </IconButton>
              <Button variant="text" color="primary" onClick={handlePreviousManifestation}>
                Précédent
              </Button>
            </React.Fragment>
          )}
          {nextManifestation && (
            <React.Fragment>
              <Button variant="text" color="primary" onClick={handleNextManifestation}>
                Suivant
              </Button>
              <IconButton aria-label="next" onClick={handleNextManifestation}>
                <KeyboardDoubleArrowRightIcon />
              </IconButton>
            </React.Fragment>
          )}
          <div style={{ flex: 1 }}></div>
          <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show chat"
            >
            <Typography>Discuter</Typography>
            <ExpandMoreIcon/>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Chat roomName={currentManifestation.id} heightVh={50}/>
            </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};
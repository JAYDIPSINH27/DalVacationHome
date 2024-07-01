import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

function RoomCard({ room }) {
  return (
    <StyledCard>
      <StyledCardMedia
        image={room.imageUrl || 'https://pixabay.com/photos/living-room-couch-interior-room-2732939/'}
        title={room.name}
      />
      <StyledCardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {room.name}
        </Typography>
        <Typography>
          {room.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Price: ${room.price} per night
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Capacity: {room.capacity} guests
        </Typography>
      </StyledCardContent>
      <CardActions>
        <Button size="small" color="primary" href={`/room/${room.id}`}>
          View Details
        </Button>
        {/* <Button size="small" color="secondary" href={`/book/${room.id}`}>
          Book Now
        </Button> */}
      </CardActions>
    </StyledCard>
  );
}

export default RoomCard;

import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const OrderCard = (props: {
    imageName: string;
    title: string;
    body: string;
    extraInfoLink?: string;
}) => {
  const imageUrl = `/images/${props.imageName}`;
  return (
    <Card sx={{ maxWidth: 345}}>
      <CardMedia
        component="img"
        sx={{
          height: 240,
          width: '100%',
          objectFit: 'cover' // might wanna change to cover later
        }}
        image={imageUrl}
        title={props.title ? props.title:""}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.body}
        </Typography>
      </CardContent>
      <CardActions>
        {props.extraInfoLink ?
          <a href={props.extraInfoLink} target='_blank'>
            <Button size="small" variant='outlined'>Extra Info</Button>
          </a>
          : <div></div>}
        <Button size="small" variant="outlined">Order</Button>
      </CardActions>
    </Card>
  );
}

export default OrderCard
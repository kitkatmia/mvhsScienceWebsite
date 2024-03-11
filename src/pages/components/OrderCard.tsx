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
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={"/public/images/"+props.imageName}
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
        {props.extraInfoLink ? <Button size="small">Extra Info</Button>: <div></div>}
        <Button size="small">Order</Button>
      </CardActions>
    </Card>
  );
}

export default OrderCard
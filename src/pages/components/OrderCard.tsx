import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import orderFormQuestions from '../../data/orderFormQuestions.json';

const OrderCard = (props: {
    imageName: string;
    title: string;
    body: string;
    extraInfoLink?: string;
}) => {
  const imageUrl = `/images/${props.imageName}`;
  let questionData: string = '{}';
  if (props.title in orderFormQuestions) {
    questionData = JSON.stringify(orderFormQuestions[props.title as keyof Object]);
  }
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
          {/* debug: link won't wokr bc we're using nextjs. need to switch to context */}
        <Link
          to={'/order_form'}
          state= {{questionData}}
          >
          <Button
            component="a"
            size="small"
            variant="outlined"
          >Home</Button>
        </Link>
        
      </CardActions>
    </Card>
  );
}

export default OrderCard
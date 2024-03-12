import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'
import { useSession } from 'next-auth/react'
import { Box, Button, Container, Grid } from '@mui/material'
import OrderCard from './components/OrderCard'
import orderOptions from '../data/orderOptions.json';

const Ordering = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar />
      <PageTitle title="Order" />
        {
          session ? (
          <Container>
            <Box>
                <Grid sx={{flexGrow:1}} rowSpacing={1} container justifyContent="space- 
                  evenly"columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {Object.entries(orderOptions).map(([key, value]) => (
                  <Grid item xs={4} key={key}>
                    <OrderCard  title={key} imageName={value.imageName} body={value.body} extraInfoLink={value.extraInfoLink? value.extraInfoLink: undefined}></OrderCard>
                    </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
          )
          : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
              You must sign-in to place an order
            </div>
          )
        }

      <Footer/>
    </>
  )
}

export default Ordering
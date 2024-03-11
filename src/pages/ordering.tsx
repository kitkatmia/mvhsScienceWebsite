import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'
import { useSession } from 'next-auth/react'
import { Box, Button, Container, Grid } from '@mui/material'
import OrderCard from './components/OrderCard'

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
              <Grid sx={{flexGrow:1}} spacing={0} container justifyContent="space- 
                evenly">
                {/* Object.entries(orderOptions).map(([title, values]) => {

                  return (
                      <p>Make of phone: {title}</p>
                  )
                }) */}
                <Grid item xs={3}>
                  <OrderCard title='title' imageName='favicon.ico' body='description'></OrderCard>
                </Grid>
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
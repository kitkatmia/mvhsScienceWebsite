import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'
import { useSession } from 'next-auth/react'
import { Box, Container, Grid } from '@mui/material'
import OrderCard from './components/OrderCard'
import orderOptions from '../data/orderOptions.json';

const Order = () => {
  const { data: session } = useSession();
  return (
    <>
      <NavBar />
      <PageTitle title="Order" />
        {
          session ? (
          <Container style={{ paddingTop: "5vh" }}>
            <p style={{display: "block", justifyContent: "center", alignItems: "center", margin: "0", paddingBottom: "5vh"}}>
              Anytime you need help with science lab activities, just put in a request form. If you're not sure which form, just email me at <a href="mailto:julie.mcvay@mvla.net" >julie.mcvay@mvla.net</a>. Use the Lab SetUp request to get individual stations set up in your classroom (for help with this, see the <a href="https://docs.google.com/document/d/16SP_6llD6TaXJ7R1kU1y95AshXhKixFkigbM4RLE0n0/edit" target='_blank'>Guide to Requesting a Lab SetUp</a> for Course teams and multi-classroom requests). If you just want bulk solutions prepared, use the Stock Solutions Form. There are forms for ordering supplies, disposing of waste, and getting equipment repaired or replaced. Scroll down to see all the options.
            </p>
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

export default Order
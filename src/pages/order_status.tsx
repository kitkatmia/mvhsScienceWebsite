import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'
import OrderTable from './components/OrderTable'
import { useSession } from "next-auth/react";

const Ordering = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <NavBar />
      <PageTitle title="Order Status" />
      <div>{(sessionData?.user.role == 1) ? "user view": <OrderTable/>}</div>
      <Footer/>
    </>
  )
}

export default Ordering
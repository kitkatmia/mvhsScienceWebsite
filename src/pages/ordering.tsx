import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import PageTitle from './components/PageTitle'

const Ordering = () => {
  return (
    <>
      <NavBar />
        <PageTitle title="Order"/>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0}}>This page is still in development... but you will be able to place your order here :P</div>
      <Footer/>
    </>
  )
}

export default Ordering
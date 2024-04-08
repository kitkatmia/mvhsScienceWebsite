import React from 'react'
import { useLocation } from "react-router-dom";
import { useOrderContext } from './contexts/OrderContext';

const OrderForm = () => {
  const { sharedState } = useOrderContext();
  console.log(sharedState)
  
  return (
    <>
      <div>OrderForm</div>
      <div>{}</div> 
    </>
  )
}

export default OrderForm
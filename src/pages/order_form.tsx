import React from 'react'
import { useLocation } from "react-router-dom";
import { useOrderContext } from './contexts/OrderContext';

const OrderForm = () => {
  const { sharedState } = useOrderContext();
  console.log(sharedState)
  // TODO - json.parse; custom components bsed on Q info
  
  return (
    <>
      <div>OrderForm</div>
      <div>{sharedState}</div> 
    </>
  )
}

export default OrderForm
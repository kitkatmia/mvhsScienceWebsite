import React from 'react'
import { useLocation } from "react-router-dom";

const OrderForm = () => {
  const location = useLocation();
  const { jsonQuestions } = location.state || {}; // Default to an empty object if state is undefined
  
  return (
    <>
      <div>OrderForm</div>
      <div>{jsonQuestions}</div>
    </>
  )
}

export default OrderForm
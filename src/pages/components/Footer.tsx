import React from 'react'
import { Typography, Link, Box } from '@mui/material';

const Footer = () => {
  return (
    <>
      <Typography component="footer" className='w-full bottom-0 left-0 flex justify-center items-center text-white py-6 mt-auto'>
           ​
      </Typography>
      <Typography component="footer" className='w-full fixed bottom-0 left-0 flex justify-center items-center bg-slate-900 text-white py-6 mt-auto'>
          Contact me at: ​<Link href="mailto:julie.mcvay@mvla.net">  julie.mcvay@mvla.net</Link>
      </Typography>
    </>
  )
}

export default Footer
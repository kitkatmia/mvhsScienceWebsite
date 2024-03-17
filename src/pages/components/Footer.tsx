import React from 'react'
import { Typography, Link } from '@mui/material';

const Footer = () => {
  return (
      <Typography component="footer" className='flex justify-center items-center bg-slate-900 text-white py-4 mt-10'>
        Contact me at: <Link href="mailto:julie.mcvay@mvla.net">  julie.mcvay@mvla.net</Link>
      </Typography>
  )
}

export default Footer
'use client'
import * as React from 'react';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Link from 'next/link';
// import { Link } from 'react-router-dom';

export default function NavBar() {
    return (
    <div className='flex justify-between p-4'>
        <Link href="/">MVLA Lab Support</Link>
        <div className='flex justify-between'>
            <ButtonGroup aria-label="outlined primary button group">
                <Link href="/ordering" passHref>
                    <Button>Supplies and Ordering</Button>
                </Link>
                <Link href="/" passHref>
                    <Button>FAQ</Button>
                </Link>
                <Link href="https://sites.google.com/mvla.net/mvlasciencelabtech/home?authuser=0" passHref>
                    <Button>General Info</Button>
                </Link>
            </ButtonGroup>
             <Button variant="outlined" className='ml-5'>Sign-in</Button>
        </div>
    </div>

  );
}

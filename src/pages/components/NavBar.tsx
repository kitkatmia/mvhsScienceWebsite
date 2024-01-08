'use client'
import * as React from 'react';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

export default function NavBar() {
    const { data: session } = useSession();
    return (
    <div className='flex justify-between p-4'>
        <Link href="/">MVLA Lab Support</Link>
        <div className='flex justify-between'>
            <ButtonGroup aria-label="outlined primary button group">
                <Link href="/ordering" passHref>
                    <Button>Supplies and Ordering</Button>
                </Link>
                <Link href="/faq" passHref>
                    <Button>FAQ</Button>
                </Link>
                <a href="https://sites.google.com/mvla.net/mvlasciencelabtech/" target='_blank'>
                    <Button>General Info</Button>
                </a>
                </ButtonGroup>
                {session ? (
                    <IconButton aria-label="settings">
                        <SettingsIcon />
                    </IconButton>
                ) : (
                    <Button className='ml-5' variant="outlined" color="success">Sign-in</Button>
                )}
             
        </div>
    </div>

  );
}

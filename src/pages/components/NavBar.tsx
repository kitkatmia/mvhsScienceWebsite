'use client'
import React from 'react';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// modal
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import SettingsBox from './SettingsBox';

export default function NavBar() {
    const { data: session } = useSession();

    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
    <div className='flex justify-between p-4'>
        <Link href="/" className='text-black no-underline'>MVLA Lab Support</Link>
        <div className='flex justify-between'>
            <ButtonGroup aria-label="outlined button group">
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
                    open ? (
                        <div>
                            <Modal
                            open={open}
                            onClose={handleClose}
                            style={{ zIndex: 1000 }} // z-index so dropdowns open in front -not behind- modal
                            >
                                <div style={{ position: 'relative', zIndex: 1001 }}> 
                                    <SettingsBox onClose={handleClose}/>
                                </div>
                            </Modal>
                        </div>
                    ) : (
                        // DEBUG: icon should show at all times
                        <IconButton aria-label="settings" onClick={handleOpen}>
                            <SettingsIcon />
                        </IconButton>
                    )
                ) : (
                    <Button className='ml-5' variant="outlined" color="success" onClick={() => void signIn()}>Sign-in</Button>
                )}
             
        </div>
    </div>

  );
}

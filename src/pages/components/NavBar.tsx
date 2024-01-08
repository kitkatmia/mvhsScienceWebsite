'use client'
import * as React from 'react';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

// modal
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Typography } from '@mui/material';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import SettingsBox from './SettingsBox';

export default function NavBar() {
    const { data: session } = useSession();

    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
    position: 'absolute' as 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -25%)',
    width: '70%',
    minWidth: "150px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    };

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
                    open ? (
                        <div>
                            <Modal
                            open={open}
                            onClose={handleClose}
                            // aria-labelledby="modal-modal-title"
                            // aria-describedby="modal-modal-description"
                            >
                                <SettingsBox session={session} />
                            {/* <Box sx={style}>
                                <Typography  variant="h6">
                                Settings for {session.user.name}
                                </Typography>
                                <Typography >
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                                </Typography>
                            </Box> */}
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

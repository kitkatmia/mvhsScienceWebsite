'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

// Modal
import Modal from '@mui/material/Modal';
import SettingsBox from './SettingsBox';
import { api } from '~/utils/api';


// const UserProps = z.object({
//   name: z.string().optional(),
//   school: z.string().optional(),
//   subjects: z.array(z.string()),
//   rooms: z.array(z.string()),
// });

interface UserProps {
    subjects: string[],
    rooms: string[],
    name: string,
    school: string
}

export default function NavBar() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = (userProps: UserProps) => {
        const mutation = api.user.upsertUserAccount.useMutation() // userProps??

        mutation.mutate(userProps, {
            onSuccess: (data) => {
                console.log('success!');
                console.log("new data: ", data);
            },
            onError: (error) => {
                console.log('not success :(');
                console.log(error);
            }
        });
        // console.log("school: ", userProps.school);
        // console.log("subject: ", userProps.subjects);
        // console.log("rooms: ", userProps.rooms);
        // if (updatedUser != null) {
        //     console.log('success!')
        //     console.log("new data: ", updatedUser.data);
        // } else {
        //     console.log('not success :(')
        // }
    }

    //   const hello = api.example.hello.useQuery({ text: "from tRPC" }); // use useMutation to upload / change data in backend

    return (
        <div className='flex justify-between p-4'>
            <Link href="/" passHref legacyBehavior>
                <a className='text-black no-underline'>MVLA Lab Support</a>
            </Link>
            <div className='flex justify-between'>
                <ButtonGroup aria-label="outlined button group">
                    <Link href="/" passHref legacyBehavior>
                        <Button component="a">Home</Button>
                    </Link>
                    <Link href="/ordering" passHref legacyBehavior>
                        <Button component="a">Supplies and Ordering</Button>
                    </Link>
                    <Link href="/faq" passHref legacyBehavior>
                        <Button component="a">FAQ</Button>
                    </Link>
                    <Button component="a" href="https://sites.google.com/mvla.net/mvlasciencelabtech/" target='_blank'>
                        General Info
                    </Button>
                    {
                        session ? (<Button component="a" href="/order_status">
                        Order Status
                        </Button>)
                            : (
                               <div></div>
                            )
                    }
                </ButtonGroup>
                {session ? (
                    open ? (
                        <Modal
                            open={open}
                            onClose={handleClose}
                            style={{ zIndex: 1000 }}
                            // z-index so dropdowns open in front -not behind- modal
                        >
                            <div style={{ position: 'relative', zIndex: 1001 }}>
                                <SettingsBox onClose={handleClose} onSubmit={handleSubmit}/>
                            </div>
                        </Modal>
                    ) : (
                        <IconButton aria-label="settings" onClick={handleOpen}>
                            <SettingsIcon />
                        </IconButton>
                    )
                ) : (
                    <Button className='ml-5' variant="outlined" color="success" onClick={
                    () => {
                        // DEBUG: probably a better way of handling this
                        signIn().catch(error => {
                        console.error("Error signing in", error);
                        }
                    );
                    }}>Sign-in</Button>
                )}
            </div>
        </div>
    );
}

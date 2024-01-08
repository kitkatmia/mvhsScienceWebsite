import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Typography } from '@mui/material';
import { Session } from 'next-auth';
import { Option, Select } from '@mui/joy';

const SettingsBox = ({ session }: {session: Session | null}) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    };
    return (
    <div>
        <Box sx={style}>
            <Typography  variant="h6">
            Settings for {session?.user.name}
            </Typography>
                <div className='pl-4'>
                    <div className='flex justify-start'>
                        <p>Select School</p>
                        <Select defaultValue="MVHS">
                            <Option value="mvhs">MVHS</Option>
                            <Option value="lahs">LAHS</Option>
                        </Select>
                    </div>
            </div>
        </Box>
    </div>
    );
}
export default SettingsBox
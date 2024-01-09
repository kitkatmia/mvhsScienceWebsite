import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Avatar, TextField, Typography, Autocomplete, Chip, AutocompleteChangeReason, AutocompleteChangeDetails } from '@mui/material';
import { Session } from 'next-auth';
import { Option, Select } from '@mui/joy';
import { Chip as JoyChip } from "@mui/joy";
import { SyntheticEvent } from 'react';
import { useSession } from 'next-auth/react';


const SettingsBox = ({ onClose }: { onClose: () => void }) => {
    const { data: session } = useSession();
    // Session | null
    // DEBUG: this should be in a context / env file, so that it can be editable
    const subjects = [
    "Pre-Bio",
    "Human Biology",
    "Biology",
    "Anatomy/Physio",
    "Biology Honors",
    "AP Bio",
    "Biotech",
    "Chem",
    "Chem Honors",
    "AP Chem",
    "Environmental Science",
    "APES",
    "Physics",
    "Physics AP1",
    "Physics APC",
    "Agricultural Ecology",
    "ASI",
    "Forensics",
    ];

    const [selectedSchool, setSelectedSchool] = useState<String>('MVHS');
    const [name, setName] = useState<String>(session?.user.name? session?.user.name: "");
    const [selectedSubjects, setSelectedSubjects] = useState<String[]>([]);
    const [selectedRooms, setSelectedRooms] = useState<String[]>([]);

  const handleCancelClick = () => {
    onClose();
  };

    const handleSchoolChange = (event: any, newSchool: String | null) => {setSelectedSchool(newSchool? newSchool:"")};

    const handleNameChange = (name: string | React.SetStateAction<String>) => {setName(name)}

    const handleRoomChange = (event: SyntheticEvent<Element, Event>, value: string[], reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<string> | undefined) => {
        setSelectedRooms(value)
    }

    const handleSubjectsChange = (event: any, newSelectedValues: React.SetStateAction<String[]>) => {
        setSelectedSubjects(newSelectedValues);
    }
    const handleSubmit = () => {
        // DEBUG: need to add router logic here
        // Handle submit logic here, e.g., send data to a server
        console.log({"name": name, "school": selectedSchool, "subjects": selectedSubjects, "rooms": selectedRooms})
        // return { "name": name, "school": selectedSchool, "subjects": selectedSubjects, "rooms": selectedRooms }
        handleCancelClick();
    };

    return (
    <Box
      className="w-1/2 my-12 m-auto flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-md"
    >
        <Typography variant="h6" textAlign="left" className="w-full flex justify-between">
            <div>
                Settings for {session?.user.name}
            </div>
            <div>
                {session?.user.image && (
                    <Avatar alt="User Pic" src={session?.user.image} />
                )}
            </div>
        </Typography>
      <div className="mt-4">
        <div className='mb-4'>
            <TextField
            label="Name (first and last)"
            defaultValue={session?.user.name}
            variant="outlined"
            className='grayscale-0'
            onChange={(event) => handleNameChange(event.target.value)}
            />
        </div>
        <div className="mb-4">
          <label htmlFor="school">School:</label>
          <Select
            id="school"
            value={selectedSchool}
            onChange={(e, newValue) => handleSchoolChange(e, newValue)}
          >
            <Option value="MVHS">MVHS</Option>
            <Option value="LAHS">LAHS</Option>
          </Select>
        </div>
        <div className="mb-4">
            <label htmlFor="subjects">Select Subject(s) Taught:</label>
            <Select
            multiple
            onChange={handleSubjectsChange}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                {selected.map((selectedOption) => (
                    <JoyChip variant="soft" color="primary">
                    {selectedOption.label}
                    </JoyChip>
                ))}
                </Box>
            )}
            sx={{
                minWidth: '15rem',
            }}
            slotProps={{
                listbox: {
                sx: {
                    width: '100%',
                },
                },
            }}
            >
            {subjects.map((subject, index) => (
            <Option key={index} value={subject}>
                {subject}
            </Option>
            ))}
            </Select>
        </div>
        <div className='mb-4'>
            <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                freeSolo
                onChange={handleRoomChange}
                renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
                }
                renderInput={(params) => (
                <TextField
                    {...params}
                    variant="filled"
                    label="Enter room number(s)"
                    placeholder="Ex: 101; Enter to confirm."
                />
                )}
            />
        </div>
        <div className="flex justify-between">
          <Button variant="outlined" onClick={handleCancelClick}>
            {/* onClick={() => {console.log('cancelpls')}} */}
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </Box>
    );
}
export default SettingsBox
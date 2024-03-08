import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from 'next-auth/react';
import OutlinedInput from '@mui/material/OutlinedInput';
import { api } from '~/utils/api';
import { EastTwoTone } from '@mui/icons-material';

interface UserDefaultProps {
  school: string,
  subjects: string[],
  rooms: string[],
}

interface UserProps {
  name: string,
  school: string
  subjects: string,
  rooms: string,
}

const SettingsBox = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (userProps: UserProps) => void}) => {
  const userQuery = api.user.getUserInfo.useQuery();

  const { data: session } = useSession();
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

  let defaultRooms = userQuery.data?.rooms
  let defaultSubjects = userQuery.data?.subjects
  let defaultSchool = userQuery.data?.school

  // console.log("default Rooms: ", defaultRooms)

  const [selectedSchool, setSelectedSchool] = useState<string>(defaultSchool ? defaultSchool : 'MVHS');
  const [name, setName] = useState<string>(session?.user.name ?? '');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(defaultSubjects ? JSON.parse(defaultSubjects): []);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(defaultRooms ? JSON.parse(defaultRooms): []);


  useEffect(() => {
    defaultRooms = userQuery.data?.rooms
    defaultSubjects = userQuery.data?.subjects
    defaultSchool = userQuery.data?.school

    setSelectedSchool(defaultSchool ? defaultSchool : 'MVHS')
    setSelectedSubjects(defaultSubjects ? JSON.parse(defaultSubjects) : [])
    setSelectedRooms(defaultRooms ? JSON.parse(defaultRooms): [])

  }, [defaultRooms, defaultSubjects, defaultSchool]);
  
  // const handleSchoolChange = ((event: SelectChangeEvent)) => {setSelectedSchool(event.target.value as string);};

  const handleSchoolChange = (event: SelectChangeEvent) => {
    setSelectedSchool(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => { setName(event.target.value); };

  // const handleSubjectsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setSelectedSubjects(event.target.value as string[]);
  // };
  const handleSubjectsChange = (event: SelectChangeEvent<typeof selectedSubjects>) => {
    const { target: { value } } = event;
    setSelectedSubjects(typeof value === 'string' ? value.split(',') : value);
  };

  const ITEM_HEIGHT = 72;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleRoomChange = (event: React.SyntheticEvent, value: string[]) => {
    setSelectedRooms(value);
  };

  const handleSubmit = () => {
    onSubmit({ name: name, school: selectedSchool, subjects: JSON.stringify(selectedSubjects), rooms: JSON.stringify(selectedRooms) });
    onClose();
  };

  return (
    <Box className="w-1/2 my-12 m-auto flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-md">
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
            value={name}
            variant="outlined"
            className='grayscale-0'
            onChange={handleNameChange}
            disabled={true} // DEBUG: may change later
          />
        </div>
        <FormControl fullWidth className="mb-4">
          <InputLabel id="school-label">School</InputLabel>
          <Select
            labelId="school-label"
            id="school-select"
            defaultValue={defaultSchool ? defaultSchool: "MVHS"}
            value={selectedSchool}
            label="School"
            onChange={handleSchoolChange}
          >
            <MenuItem value="MVHS">MVHS</MenuItem>
            <MenuItem value="LAHS">LAHS</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel id="subjects-label">Select Subject(s) Taught</InputLabel>
          <Select
            labelId="subjects-label"
            id="subjects-select"
            multiple
            value={selectedSubjects}
            input={<OutlinedInput label="Select Subject(s) Taught" />}
            onChange={handleSubjectsChange}
            MenuProps={MenuProps}
          >
            {subjects.map((subject, index) => (
              <MenuItem key={index} value={subject}>{subject}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className='mb-4'>
          <Autocomplete
            multiple
            id="tags-filled"
            options={[]}
            freeSolo
            onChange={handleRoomChange}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                
                <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
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
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default SettingsBox;

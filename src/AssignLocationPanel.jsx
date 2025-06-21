import React, { useState, useEffect } from 'react';
import { IconButton, Box, Typography, TextField, Checkbox } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import styles from './AssignLocationPanel.module.css';

const initialLocations = [
    { name: 'Milwaukee', selected: false },
    { name: 'Orlando', selected: false },
    { name: 'Montgomery', selected: false },
    { name: 'New Orleans', selected: false },
    { name: 'Philadelphia', selected: false },
    { name: 'Austin', selected: false },
    { name: 'Reno', selected: false },
    { name: 'Jacksonville', selected: false },
    { name: 'Albany', selected: false },
    { name: 'Providence', selected: false },
    { name: 'Virginia Beach', selected: false },
    { name: 'Milwaukee', selected: false },
    { name: 'Tucson', selected: false },
];

const AssignLocationPanel = ({ onClose }) => {
  const [locations, setLocations] = useState(initialLocations);
  const [someSelected, setSomeSelected] = useState(false);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const selectedCount = locations.filter(l => l.selected).length;
    setAllSelected(selectedCount === locations.length);
    setSomeSelected(selectedCount > 0 && selectedCount < locations.length);
  }, [locations]);


  const handleLocationToggle = (index) => {
    const newLocations = [...locations];
    newLocations[index].selected = !newLocations[index].selected;
    setLocations(newLocations);
  };

  const handleSelectAll = (event) => {
    const newLocations = locations.map(l => ({ ...l, selected: event.target.checked }));
    setLocations(newLocations);
  };

  return (
    <Box className={styles.container} sx={{
        width: '572px',
        height: '100%',
        borderLeft: '1px solid #ECECEE',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F8F8FB'
    }}>
        <Box sx={{
            height: 80,
            paddingTop: '24px',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignSelf: 'stretch',
        }}>
            <Box sx={{
                paddingX: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
            }}>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" sx={{
                    color: '#121214',
                    fontSize: 20,
                    fontFamily: 'Inter',
                    fontWeight: '600',
                }}>
                    Assign to locations
                </Typography>
            </Box>
        </Box>
        <Box sx={{
            flexGrow: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
        }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search for any restaurant locations..."
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#747475', marginRight: '8px' }} />,
                    style: {
                        background: 'white',
                        borderRadius: 10,
                        fontSize: '14px',
                        color: '#8B8B8C'
                    }
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingY: '12px', paddingLeft: '4px', paddingRight: '12px' }}>
                <Typography sx={{ fontWeight: '600', fontSize: '14px' }}>Select all restaurants</Typography>
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
            </Box>

            <Box sx={{ background: 'white', borderRadius: '12px', padding: '8px 12px' }}>
                {locations.map((loc, index) => (
                    <Box key={index} sx={{ borderBottom: index < locations.length - 1 ? '1px solid #ECECEE' : 'none', paddingY: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Box sx={{ width: 32, height: 32, background: '#F3F3F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <BusinessIcon sx={{ color: '#454547' }}/>
                                </Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: '500' }}>{loc.name}</Typography>
                            </Box>
                            <Checkbox checked={loc.selected} onChange={() => handleLocationToggle(index)} />
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>

        <Box sx={{
            padding: '16px 20px',
            background: 'white',
            boxShadow: '0px -4px 24px rgba(18, 18, 20, 0.06)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
        }}>
            <button onClick={onClose} style={{
                height: 44,
                minWidth: 112,
                padding: '10px 24px',
                background: 'white',
                borderRadius: 8,
                border: '1px solid #2A4FD6',
                color: '#2A4FD6',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                cursor: 'pointer'
            }}>
                Cancel
            </button>
            <button style={{
                height: 44,
                minWidth: 112,
                padding: '10px 24px',
                background: '#2A4FD6',
                borderRadius: 8,
                border: '1px solid #213EA7',
                color: '#F8F8FB',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: '500',
                cursor: 'pointer'
            }}>
                Assign
            </button>
        </Box>
    </Box>
  );
};

export default AssignLocationPanel; 
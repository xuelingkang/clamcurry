import React, { FC } from 'react';
import { Box } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const HomePanel: FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                height: '100%',
                opacity: 0.05,
            }}
        >
            <MenuBookIcon
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
        </Box>
    );
};

export default HomePanel;

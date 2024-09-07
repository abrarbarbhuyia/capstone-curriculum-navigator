import React from 'react';
import PersonalizeCard from '../components/personalizeCard';
import PersonalizeTitle from '../components/personalizeTitle';
import { Box } from '@mui/material';

const Home = () => {
    return (
        <Box>
            <PersonalizeTitle />
            <PersonalizeCard />
        </Box>
    );
};

export default Home;
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const Chat = () => {
  const [course, setCourse] = useState(null);
  const [major, setMajor] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    // Retrieve the saved data from localStorage
    const savedCourse = localStorage.getItem('selectedCourse');
    const savedMajor = localStorage.getItem('selectedMajor');
    const savedYear = localStorage.getItem('selectedYear');

    setCourse(savedCourse);
    setMajor(savedMajor);
    setYear(savedYear);
  }, []);

  return (
    <Box>
      <h1>Chat</h1>
      <p>Course: {course}</p>
      <p>Major: {major}</p>
      <p>Year: {year}</p>
    </Box>
  );
};

export default Chat;
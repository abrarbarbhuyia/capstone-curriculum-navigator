import React, { useState, useEffect } from "react";
import { Card, Box, CardContent, Typography, Button, Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import Papa from 'papaparse'; 

const courseFile = '/data/courseEng_filtered.csv'; 
const majorsFile = '/data/majorEng.csv'; 

const PersonalizeCard = () => {
  const navigate = useNavigate(); // Hook to navigate to /chat

  const years = ["2020"]; // Since we are using 2020 scraped data from Chris.

  const [courses, setCourses] = useState([]); 
  const [majors, setMajors] = useState([]); 
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null); 

  // Fetch and parse the Course CSV file
  useEffect(() => {
    Papa.parse(courseFile, {
      download: true,
      header: true, 
      complete: (result) => {
        // Extract "Full Title" and remove duplicates using Set
        const fullTitles = [...new Set(result.data.map((row) => row["Full Title"] || "").filter(Boolean))];
        setCourses(fullTitles); 
      },
      error: (error) => {
        console.error("Error parsing course CSV file:", error);
      },
    });
  }, []);

  // Fetch and parse the Major CSV file
  useEffect(() => {
    Papa.parse(majorsFile, {
      download: true,
      header: true, 
      complete: (result) => {
        // Extract "Full Title" and remove duplicates using Set
        const fullTitles = [...new Set(result.data.map((row) => row["Short Title"] || "").filter(Boolean))];
        setMajors(fullTitles); 
      },
      error: (error) => {
        console.error("Error parsing major CSV file:", error);
      },
    });
  }, []);

  const handleProceed = () => {
    // Save the selected data to localStorage
    localStorage.setItem('selectedCourse', selectedCourse);
    localStorage.setItem('selectedMajor', selectedMajor);
    localStorage.setItem('selectedYear', selectedYear);

    navigate("/chat");
  };

  // Check if all required fields are filled
  const isFormValid = selectedCourse && selectedMajor && selectedYear;

  return (
    <Box className="flex justify-center mt-10">
      <Card
        sx={{
          width: "450px",
          height: "450px", 
          alignSelf: "center",
          borderRadius: "12px",
          padding: "12px",
          border: "2px solid #f0f0f0",
          boxShadow: "none",
        }}
      >
        <CardContent className="p-3 flex flex-col">
          <Box>
            <Typography className="text-2xl font-semibold">
              Profile Information
            </Typography>

            {/* Course Selection */}
            <Box className="mt-5">
              <Typography variant="subtitle1">Select Course</Typography>
              <Autocomplete
                id="course-select"
                options={courses}
                getOptionLabel={(option) => option}
                value={selectedCourse}
                onChange={(event, newValue) => setSelectedCourse(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Course"
                    variant="outlined"
                    required 
                  />
                )}
              />
            </Box>

            {/* Major Selection */}
            <Box className="mt-5">
              <Typography variant="subtitle1">Select Major</Typography>
              <Autocomplete
                id="major-select"
                options={majors}
                getOptionLabel={(option) => option}
                value={selectedMajor}
                onChange={(event, newValue) => setSelectedMajor(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Major"
                    variant="outlined"
                    required 
                  />
                )}
              />
            </Box>

            {/* Year Selection */}
            <Box className="mt-5">
              <Typography variant="subtitle1">Commencing Year</Typography>
              <Autocomplete
                id="year-select"
                options={years}
                getOptionLabel={(option) => option}
                value={selectedYear}
                onChange={(event, newValue) => setSelectedYear(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year"
                    variant="outlined"
                    required 
                  />
                )}
              />
            </Box>

            <Box className="mt-5 justify-center flex">
              <Button 
                variant="contained" 
                sx={{ borderRadius: "12px" }}
                onClick={handleProceed} 
                disabled={!isFormValid} // Disable button if form is not valid
              >
                Proceed to chat
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PersonalizeCard;
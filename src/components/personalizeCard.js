import React, { useState } from "react";
import { Card, Box, CardContent, Typography, Button, Autocomplete, TextField } from "@mui/material";

const PersonalizeCard = () => {
  const degrees = [
    "C09066 Bachelor of Engineering (Honours)",
    "C09067 Bachelor of Engineering (Honours) Diploma in Professional Engineering Practice",
    "C10066 Bachelor of Engineering Science",
    "C10408 Bachelor of Technology",
  ];

  const years = [
    "2020", "2021", "2022", "2023"
  ]

  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);

  return (
    <Box class="flex justify-center mt-10">
      <Card
        sx={{
          width: "450px",
          height: "340px",
          alignSelf: "center",
          borderRadius: "12px",
          padding: "12px",
          border: "2px solid #f0f0f0",
          boxShadow: "none",
        }}
      >
        <CardContent class="p-3 flex flex-col">
          <Box>
            <Typography class="text-2xl font-semibold">
              Profile Information
            </Typography>
            <Box class="mt-5">
              <Typography variant="subtitle1">Engineering Degree</Typography>
              <Autocomplete
                limitTags={2}
                id="multiple-limit-tags"
                options={degrees}
                getOptionLabel={(option) => option}
                value={selectedDegrees}
                onChange={(event, newValue) => setSelectedDegrees(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                  />
                )}
              />
            </Box>
            <Box class="mt-5">
              <Typography variant="subtitle1">Commecing Year</Typography>
              <Autocomplete
                limitTags={2}
                id="multiple-limit-tags"
                options={years}
                getOptionLabel={(option) => option}
                value={selectedYear}
                onChange={(event, newValue) => setSelectedYear(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                  />
                )}
              />
            </Box>
            <Box class="mt-5 justify-center flex">
                <Button variant="contained" sx={{borderRadius: "12px"}}>
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
import React from "react";
import { Box, Typography } from "@mui/material";

const PersonalizeTitle = () => {
  return (
    <Box class="flex flex-col">
      <Box class="flex flex-row justify-center h-24 m-22 items-center">
        <img src="/uts-logo.png" alt="UTS Logo" class="pr-4 h-20" />
        <Typography class="font-semibold text-5xl content-center pt-1">
          Handbook Helper
        </Typography>
      </Box>
      <Box class="flex justify-center">
        <Typography class="font-light text-2xl content-center text-wrap w-80 text-center">
          Your one-stop solution to find course information
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonalizeTitle;

import React from "react";
import { Box } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "105px",
        backgroundImage: "url(header.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    </Box>
  );
};

export default Header;

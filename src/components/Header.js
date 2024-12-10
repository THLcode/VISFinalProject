// src/components/Header.jsx
import React from "react";
import { AppBar, Box, Toolbar, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoSection from "./LogoSection"; // LogoSection import

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ marginRight: "auto" }}>
            <LogoSection onClick={handleLogoClick} />
          </Box>
          <Button component={RouterLink} to="/signin" color="inherit">
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

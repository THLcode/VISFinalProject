// src/components/Header.jsx
import React, { useContext } from "react";
import { AppBar, Box, Toolbar, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoSection from "./LogoSection";
import { UserContext } from "../UserContext"; // 추가

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <AppBar position="fixed" color="inherit" elevation={4}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ marginRight: "auto" }}>
            <LogoSection onClick={handleLogoClick} />
          </Box>
          {user ? (
            <>
              <Box sx={{ mr: 2 }}>Welcome, {user.email}</Box>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button component={RouterLink} to="/signin" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

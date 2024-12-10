import React from "react";
import { Box, Container, Button } from "@mui/material";
import Header from "./Header"; // Header 컴포넌트 가져오기
import { Link as RouterLink } from "react-router-dom";

const LandingPage = () => {
  return (
    <Box>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4F46E530, #10B98130)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container>
          <h1>From Data to Insight</h1>
          <h2>
            Visualization Tools for Mental Health Research Using Digital Sensor
            Data
          </h2>
          <Button
            component={RouterLink}
            to="/signin"
            variant="contained"
            color="primary"
            size="large"
          >
            Check Data
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

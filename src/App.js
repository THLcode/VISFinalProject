// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header"; // Header 컴포넌트
// import SignIn from "./components/SignIn"; // SignIn 페이지
// import LandingPage from "./components/LandingPage";

// function App() {
//   return (
//     <Router>
//       <Header />
//       <Routes>
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/" element={<LandingPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header"; // Header 컴포넌트
import SignIn from "./components/SignIn"; // SignIn 페이지
import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

// 테마 설정
const theme = createTheme({
  palette: {
    mode: "light", // light 모드 (dark 모드로 변경 가능)
    primary: {
      main: "#1976d2", // 기본 Primary 색상
    },
    secondary: {
      main: "#dc004e", // Secondary 색상
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* 기본 CSS 리셋 */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

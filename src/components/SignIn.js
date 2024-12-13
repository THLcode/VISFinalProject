// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   Divider,
//   FormControlLabel,
//   IconButton,
//   InputAdornment,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import {
//   Google,
//   Facebook,
//   Visibility,
//   VisibilityOff,
// } from "@mui/icons-material";

// import LogoSection from "../components/LogoSection";

// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     rememberMe: false,
//   });

//   const handleChange = (event) => {
//     const { name, value, checked } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "rememberMe" ? checked : value,
//     }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("Form submitted:", formData);
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//   const navigate = useNavigate();

//   // Sign up 버튼 클릭 핸들러 추가
//   const handleSignupClick = () => {
//     navigate("/signup");
//   };

//   const handleLogoClick = () => {
//     navigate("/");
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         background: "linear-gradient(135deg, #4F46E530, #10B98130)",
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             backgroundColor: "rgba(255, 255, 255, 0.9)",
//             backdropFilter: "blur(10px)",
//           }}
//         >
//           {/* Logo and Brand */}
//           <LogoSection onClick={handleLogoClick} />

//           <Box
//             component="form"
//             onSubmit={handleSubmit}
//             sx={{ mt: 1, width: "100%" }}
//           >
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               id="password"
//               autoComplete="current-password"
//               value={formData.password}
//               onChange={handleChange}
//               type={showPassword ? "text" : "password"}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   color="primary"
//                 />
//               }
//               label="Remember me"
//             />

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2, py: 1.5 }}
//             >
//               Sign in
//             </Button>

//             <Divider sx={{ my: 2 }}>
//               <Typography color="text.secondary" variant="body2">
//                 or
//               </Typography>
//             </Divider>
//             <Box sx={{ mt: 3, textAlign: "center" }}>
//               <Typography variant="body2" color="text.secondary">
//                 Don't have an account?{" "}
//                 <Button
//                   variant="text"
//                   onClick={handleSignupClick}
//                   sx={{ p: 0, minWidth: "auto", verticalAlign: "baseline" }}
//                 >
//                   Sign up
//                 </Button>
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default LoginPage;

import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LogoSection from "../components/LogoSection";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

// dummy user list
const dummyUsers = [
  { email: "test@example.com", password: "password123" },
  { email: "user@example.com", password: "userpass" },
];

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const { setUser } = useContext(UserContext); // UserContext에서 setUser 가져오기
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 로그인 로직
    const { email, password } = formData;
    const foundUser = dummyUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      // 로그인 성공
      setUser({ email: foundUser.email });
      navigate("/dashboard");
    } else {
      // 로그인 실패 처리 (alert, error메시지 등)
      alert("Invalid email or password");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #4F46E530, #10B98130)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <LogoSection onClick={handleLogoClick} />

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign in
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography color="text.secondary" variant="body2">
                or
              </Typography>
            </Divider>
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  variant="text"
                  onClick={handleSignupClick}
                  sx={{ p: 0, minWidth: "auto", verticalAlign: "baseline" }}
                >
                  Sign up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

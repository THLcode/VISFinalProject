// src/components/LogoSection.jsx
import { Box } from "@mui/material";
import logoImage from "../assets/logo.png";

const LogoSection = ({ onClick }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      cursor: "pointer",
      // Header에서 사용할 때 margin-bottom 제거
      "& img": {
        height: "40px", // Header의 기존 로고 크기와 동일하게 설정
        width: "auto",
        objectFit: "contain",
      },
    }}
    onClick={onClick}
  >
    <img src={logoImage} alt="Sitemark Logo" />
  </Box>
);

export default LogoSection;

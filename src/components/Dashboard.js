// import React, { useState } from "react";
// import {
//   Box,
//   Paper,
//   Grid,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   Checkbox,
//   Typography,
//   Button,
//   Container,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   TextField,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import Header from "./Header";
// import html2canvas from "html2canvas";
// import result2 from "../assets/result2.png";
// import ScatterPlot from "./Scatterplot.js";

// // 정신건강 체크리스트
// const MENTAL_HEALTH_CONDITIONS = [
//   { id: "igds", label: "IGDS" },
//   { id: "stai", label: "STAI-X-1" },
//   { id: "phq9", label: "PHQ-9" },
//   { id: "bis15", label: "BIS-15" },
//   { id: "bpaq", label: "BPAQ" },
//   { id: "asrs", label: "ASRS-V1.1" },
//   { id: "ybocs", label: "Y-BOCS" },
//   { id: "pq16", label: "PQ-16" },
// ];

// // 계층 구조 Feature 목록
// const FEATURE_TREE = [
//   {
//     category: "nkeys_btw",
//     features: ["backspaces", "spaces"],
//   },
//   {
//     category: "ratio",
//     features: [
//       "language",
//       "backspace",
//       "space",
//       "shift",
//       "enter",
//       "punc",
//       "special",
//       "num",
//     ],
//   },
//   {
//     category: "num_per_sec",
//     features: [
//       "language",
//       "backspace",
//       "space",
//       "shift",
//       "enter",
//       "punc",
//       "special",
//       "num",
//     ],
//   },
//   {
//     category: "pause",
//     features: ["pause_3sec", "pause_4sec", "pause_5sec"],
//   },
//   {
//     category: "pressure",
//     features: ["pressureMin", "pressureMax", "pressureAvg"],
//   },
//   {
//     category: "area",
//     features: ["areaMin", "areaMax", "areaAvg"],
//   },
//   {
//     category: "streak",
//     features: ["streak_3", "streak_4", "streak_5"],
//   },
//   {
//     category: "graph",
//     features: [
//       "trigraph",
//       "quadragraph",
//       "pentagraph",
//       "hexagraph",
//       "heptagraph",
//       "octagraph",
//     ],
//   },
//   {
//     category: "others",
//     features: ["ppd", "hd", "typing_time", "key_per_sec"],
//   },
// ];

// // 샘플 아이디 목록 (개인 vs 개인에서는 사용 안 함. 원하면 다른 모드용으로 남겨둘 수 있음)
// // const SAMPLE_IDS = ["137", "458", "647", "723", "912", "1344", "1532", "2051"];

// // 박스 제목을 꾸며주는 공용 컴포넌트
// const TitleBox = ({ children }) => (
//   <Box
//     sx={{
//       backgroundColor: "#f0f0f0",
//       border: "2px solid #ccc",
//       borderRadius: 1,
//       textAlign: "center",
//       mb: 1,
//       py: 1,
//     }}
//   >
//     <Typography variant="h6" sx={{ m: 0, fontWeight: "bold" }}>
//       {children}
//     </Typography>
//   </Box>
// );

// // 정신건강 섹션
// const MentalHealthSection = ({ title, conditions, onChange, values }) => (
//   <Paper
//     elevation={1}
//     sx={{
//       p: 2,
//       border: "1px solid #ddd",
//       borderRadius: 2,
//       width: "100%",
//       height: "100%",
//       overflow: "hidden",
//       display: "flex",
//       flexDirection: "column",
//       fontSize: {
//         xs: "0.75rem",
//         sm: "0.8rem",
//         md: "0.9rem",
//         lg: "1rem",
//       },
//     }}
//   >
//     <TitleBox>{title}</TitleBox>
//     <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
//       <Grid container spacing={1}>
//         <Grid item xs={6}>
//           {conditions.slice(0, 4).map((condition) => (
//             <FormControlLabel
//               key={condition.id}
//               control={
//                 <Checkbox
//                   checked={values?.[condition.id] || false}
//                   onChange={onChange}
//                   name={condition.id}
//                 />
//               }
//               label={condition.label}
//               sx={{ display: "block", mb: 1 }}
//             />
//           ))}
//         </Grid>
//         <Grid item xs={6}>
//           {conditions.slice(4).map((condition) => (
//             <FormControlLabel
//               key={condition.id}
//               control={
//                 <Checkbox
//                   checked={values?.[condition.id] || false}
//                   onChange={onChange}
//                   name={condition.id}
//                 />
//               }
//               label={condition.label}
//               sx={{ display: "block", mb: 1 }}
//             />
//           ))}
//         </Grid>
//       </Grid>
//     </Box>
//   </Paper>
// );

// const Dashboard = () => {
//   const [comparisonMode, setComparisonMode] = useState("OnevsOne"); // 초기값 예시
//   const [selectedFeatures, setSelectedFeatures] = useState([]);
//   const [mentalHealth, setMentalHealth] = useState({});

//   // 개인 vs 개인에서 직접 입력할 숫자를 저장할 상태
//   const [customTarget, setCustomTarget] = useState("");
//   const [savedTarget, setSavedTarget] = useState(""); // 최종 저장된 숫자

//   const handleModeChange = (event) => {
//     setComparisonMode(event.target.value);
//     // 모드 변경 시 입력 초기화
//     setCustomTarget("");
//     setSavedTarget("");
//   };

//   // feature mean/std 선택 로직
//   const handleFeatureClick = (category, feature, stat) => {
//     setSelectedFeatures((prev) => {
//       const existingIndex = prev.findIndex(
//         (item) =>
//           item.category === category &&
//           item.feature === feature &&
//           item.stat === stat
//       );
//       if (existingIndex > -1) {
//         const newArray = [...prev];
//         newArray.splice(existingIndex, 1);
//         return newArray;
//       }
//       let newArray = [...prev];
//       if (newArray.length === 2) {
//         newArray.shift();
//       }
//       newArray.push({ category, feature, stat });
//       return newArray;
//     });
//   };

//   const handleMentalHealthChange = (event) => {
//     const { name, checked } = event.target;
//     setMentalHealth((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   // 개인 vs 개인: 1~300 사이 숫자 입력
//   const handleCustomTargetChange = (e) => {
//     setCustomTarget(e.target.value);
//   };

//   const handleConfirmTarget = () => {
//     const val = parseInt(customTarget, 10);
//     if (val >= 1 && val <= 300) {
//       setSavedTarget(val);
//       alert(`선택하신 대상: ${val}`);
//     } else {
//       alert("1~300 사이의 숫자를 입력하세요.");
//     }
//   };

//   const handleSaveResults = async () => {
//     const dashboard = document.getElementById("dashboard-content");
//     try {
//       const canvas = await html2canvas(dashboard, {
//         scale: 2,
//         backgroundColor: null,
//         logging: false,
//       });

//       const image = canvas.toDataURL("image/png");
//       const link = document.createElement("a");
//       link.href = image;
//       link.download = `dashboard-${new Date().toISOString().slice(0, 10)}.png`;
//       link.click();
//     } catch (error) {
//       console.error("Screenshot failed:", error);
//     }
//   };

//   // 상단 row 레이아웃 동적 계산
//   let myBoxXs = 3;
//   let groupBoxXs = 3;
//   let showTargetSelect = true;
//   let targetSelectXs = 4;
//   let myBoxTitle = "나";
//   let groupBoxTitle = "그룹";

//   if (comparisonMode === "OnevsGroup") {
//     // 대상 선택 안 보임, '나'=xs=5, '그룹'=xs=5
//     showTargetSelect = false;
//     myBoxXs = 5;
//     groupBoxXs = 5;
//   } else if (comparisonMode === "GroupvsGroup") {
//     // 대상 선택 안 보임, '나'=xs=5->'그룹1', '그룹'=xs=5->'그룹2'
//     showTargetSelect = false;
//     myBoxXs = 5;
//     groupBoxXs = 5;
//     myBoxTitle = "그룹1";
//     groupBoxTitle = "그룹2";
//   }

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #4F46E530, #10B98130)",
//         width: "100%",
//         pb: 4,
//       }}
//     >
//       <Header />
//       <Container maxWidth="false" sx={{ width: "100%", maxWidth: "1800px" }}>
//         <Box sx={{ pt: 10 }}>
//           <Paper
//             id="dashboard-content"
//             elevation={3}
//             sx={{
//               p: 3,
//               display: "flex",
//               flexDirection: "column",
//               height: "80vh",
//               overflow: "hidden",
//               margin: "0 auto",
//             }}
//           >
//             {/* 전체 2개 row: 위 35%, 아래 65% */}
//             <Grid container spacing={2} sx={{ flex: 1, height: "100%" }}>
//               {/* 첫 번째 행(35%) */}
//               <Grid item xs={12} sx={{ height: "35%" }}>
//                 <Grid container spacing={2} sx={{ height: "100%" }}>
//                   {/* Comparison Mode (xs=2) */}
//                   <Grid item xs={2} sx={{ height: "100%" }}>
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         border: "1px solid #ddd",
//                         borderRadius: 2,
//                         height: "100%",
//                         overflow: "hidden",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <TitleBox>Comparison Mode</TitleBox>
//                       <FormControl
//                         component="fieldset"
//                         sx={{ flex: 1, overflowY: "auto" }}
//                       >
//                         <RadioGroup
//                           value={comparisonMode}
//                           onChange={handleModeChange}
//                         >
//                           <FormControlLabel
//                             value="OnevsOne"
//                             control={<Radio />}
//                             label="개인 vs 개인"
//                           />
//                           <FormControlLabel
//                             value="OnevsGroup"
//                             control={<Radio />}
//                             label="개인 vs 그룹"
//                           />
//                           <FormControlLabel
//                             value="GroupvsGroup"
//                             control={<Radio />}
//                             label="그룹 vs 그룹"
//                           />
//                         </RadioGroup>
//                       </FormControl>
//                     </Paper>
//                   </Grid>

//                   {/* 나(그룹1) */}
//                   <Grid item xs={myBoxXs} sx={{ height: "100%" }}>
//                     <MentalHealthSection
//                       title={myBoxTitle}
//                       conditions={MENTAL_HEALTH_CONDITIONS}
//                       onChange={handleMentalHealthChange}
//                       values={mentalHealth}
//                     />
//                   </Grid>

//                   {/* 대상 선택 (개인 vs 개인일때만) */}
//                   {showTargetSelect ? (
//                     <Grid item xs={targetSelectXs} sx={{ height: "100%" }}>
//                       <Paper
//                         elevation={1}
//                         sx={{
//                           p: 2,
//                           border: "1px solid #ddd",
//                           borderRadius: 2,
//                           height: "100%",
//                           overflow: "hidden",
//                           display: "flex",
//                           flexDirection: "column",
//                         }}
//                       >
//                         <TitleBox>대상 선택</TitleBox>

//                         <Box sx={{ overflowY: "auto", flex: 1 }}>
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               mt: 2,
//                               mb: 1,
//                               fontWeight: "bold",
//                               display: "flex",
//                               justifyContent: "center",
//                             }}
//                           >
//                             1~300중에 비교하실 대상을 입력하세요
//                           </Typography>
//                           {/* 전체 너비를 차지하도록 fullWidth 적용 */}
//                           <TextField
//                             type="number"
//                             value={customTarget}
//                             onChange={handleCustomTargetChange}
//                             label="1~300 사이의 숫자 입력"
//                             inputProps={{ min: 1, max: 300 }}
//                             fullWidth
//                             sx={{ mb: 2 }}
//                           />

//                           {/* 확인 버튼은 아래에 위치시키고 싶은 경우 마진을 더 줌 */}
//                           <Box
//                             sx={{
//                               display: "flex",
//                               justifyContent: "center",
//                               mt: 2,
//                             }}
//                           >
//                             <Button
//                               variant="contained"
//                               onClick={handleConfirmTarget}
//                               size="middle" // 버튼 크기 작게
//                             >
//                               확인
//                             </Button>
//                           </Box>

//                           {savedTarget && (
//                             <Typography variant="body2" sx={{ mt: 2 }}>
//                               선택된 대상: {savedTarget}
//                             </Typography>
//                           )}
//                         </Box>
//                       </Paper>
//                     </Grid>
//                   ) : null}

//                   {/* 그룹(그룹2) */}
//                   <Grid item xs={groupBoxXs} sx={{ height: "100%" }}>
//                     <MentalHealthSection
//                       title={groupBoxTitle}
//                       conditions={MENTAL_HEALTH_CONDITIONS}
//                       onChange={() => {}}
//                       values={{}}
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>

//               {/* 두 번째 행(65%) - Features, Chart1, Chart2 */}
//               <Grid item xs={12} sx={{ height: "65%" }}>
//                 <Grid container spacing={2} sx={{ height: "100%" }}>
//                   {/* Features xs=2 */}
//                   <Grid item xs={2} sx={{ height: "100%" }}>
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         border: "1px solid #ddd",
//                         borderRadius: 2,
//                         height: "100%",
//                         overflow: "hidden",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <TitleBox>Features</TitleBox>
//                       <Box sx={{ overflowY: "auto", flex: 1 }}>
//                         {FEATURE_TREE.map((group) => (
//                           <Accordion key={group.category}>
//                             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                               {group.category}
//                             </AccordionSummary>
//                             <AccordionDetails>
//                               {group.features.map((feature) => (
//                                 <Accordion key={feature}>
//                                   <AccordionSummary
//                                     expandIcon={<ExpandMoreIcon />}
//                                   >
//                                     {feature}
//                                   </AccordionSummary>
//                                   <AccordionDetails>
//                                     <Button
//                                       variant={
//                                         selectedFeatures.some(
//                                           (item) =>
//                                             item.category === group.category &&
//                                             item.feature === feature &&
//                                             item.stat === "mean"
//                                         )
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       onClick={() =>
//                                         handleFeatureClick(
//                                           group.category,
//                                           feature,
//                                           "mean"
//                                         )
//                                       }
//                                       sx={{
//                                         mb: 1,
//                                         width: "100%",
//                                         textAlign: "left",
//                                       }}
//                                     >
//                                       mean
//                                     </Button>
//                                     <Button
//                                       variant={
//                                         selectedFeatures.some(
//                                           (item) =>
//                                             item.category === group.category &&
//                                             item.feature === feature &&
//                                             item.stat === "std"
//                                         )
//                                           ? "contained"
//                                           : "outlined"
//                                       }
//                                       onClick={() =>
//                                         handleFeatureClick(
//                                           group.category,
//                                           feature,
//                                           "std"
//                                         )
//                                       }
//                                       sx={{
//                                         mb: 1,
//                                         width: "100%",
//                                         textAlign: "left",
//                                       }}
//                                     >
//                                       std
//                                     </Button>
//                                   </AccordionDetails>
//                                 </Accordion>
//                               ))}
//                               {group.features.length === 0 && (
//                                 <Typography
//                                   variant="body2"
//                                   color="textSecondary"
//                                 >
//                                   No features available.
//                                 </Typography>
//                               )}
//                             </AccordionDetails>
//                           </Accordion>
//                         ))}
//                       </Box>
//                     </Paper>
//                   </Grid>

//                   {/* Chart1 xs=5 */}
//                   <Grid item xs={5} sx={{ height: "100%" }}>
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         border: "1px solid #ddd",
//                         borderRadius: 2,
//                         height: "100%",
//                         overflow: "hidden",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <TitleBox>Chart 1</TitleBox>
//                       <Box sx={{ flex: 1, position: "relative" }}>
//                         <ScatterPlot
//                           selectedFeatures={selectedFeatures}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                           }}
//                         />
//                       </Box>
//                     </Paper>
//                   </Grid>

//                   {/* Chart2 xs=5 */}
//                   <Grid item xs={5} sx={{ height: "100%" }}>
//                     <Paper
//                       elevation={1}
//                       sx={{
//                         p: 2,
//                         border: "1px solid #ddd",
//                         borderRadius: 2,
//                         height: "100%",
//                         overflow: "hidden",
//                         display: "flex",
//                         flexDirection: "column",
//                       }}
//                     >
//                       <TitleBox>Chart 2</TitleBox>
//                       <Box sx={{ flex: 1, position: "relative" }}>
//                         <img
//                           src={result2}
//                           alt="Chart 2"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "contain",
//                             display: "block",
//                           }}
//                         />
//                       </Box>
//                     </Paper>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* 결과 저장 버튼 */}
//           <Box sx={{ mt: 4, textAlign: "right" }}>
//             <Button
//               variant="contained"
//               onClick={handleSaveResults}
//               sx={{
//                 bgcolor: "#007BFF",
//                 color: "white",
//                 "&:hover": { bgcolor: "#0056b3" },
//               }}
//             >
//               결과 저장
//             </Button>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.js

import React, { useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  Typography,
  Button,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";
import html2canvas from "html2canvas";
import ScatterPlot from "./Scatterplot.js";
import HistogramPlot from "./HistogramPlot.js";

// 박스에 제목 느낌을 주는 컴포넌트 (필요 없으면 제거해도 됩니다)
const TitleBox = ({ children }) => (
  <Box
    sx={{
      backgroundColor: "#f0f0f0",
      border: "2px solid #ccc",
      borderRadius: 1,
      textAlign: "center",
      mb: 1,
      py: 1,
    }}
  >
    <Typography variant="h6" sx={{ m: 0, fontWeight: "bold" }}>
      {children}
    </Typography>
  </Box>
);

// 정신건강 체크리스트
const MENTAL_HEALTH_CONDITIONS = [
  { id: "igds", label: "IGDS" },
  { id: "stai", label: "STAI-X-1" },
  { id: "phq9", label: "PHQ-9" },
  { id: "bis15", label: "BIS-15" },
  { id: "bpaq", label: "BPAQ" },
  { id: "asrs", label: "ASRS-V1.1" },
  { id: "ybocs", label: "Y-BOCS" },
  { id: "pq16", label: "PQ-16" },
];

// 계층 구조 Feature 목록
const FEATURE_TREE = [
  {
    category: "nkeys_btw",
    features: ["backspaces", "spaces"],
  },
  {
    category: "ratio",
    features: [
      "language",
      "backspace",
      "space",
      "shift",
      "enter",
      "punc",
      "special",
      "num",
    ],
  },
  {
    category: "num_per_sec",
    features: [
      "language",
      "backspace",
      "space",
      "shift",
      "enter",
      "punc",
      "special",
      "num",
    ],
  },
  {
    category: "pause",
    features: ["pause_3sec", "pause_4sec", "pause_5sec"],
  },
  {
    category: "pressure",
    features: ["pressureMin", "pressureMax", "pressureAvg"],
  },
  {
    category: "area",
    features: ["areaMin", "areaMax", "areaAvg"],
  },
  {
    category: "streak",
    features: ["streak_3", "streak_4", "streak_5"],
  },
  {
    category: "graph",
    features: [
      "trigraph",
      "quadragraph",
      "pentagraph",
      "hexagraph",
      "heptagraph",
      "octagraph",
    ],
  },
  {
    category: "others",
    features: ["ppd", "hd", "typing_time", "key_per_sec"],
  },
];

// MentalHealthSection 컴포넌트
const MentalHealthSection = ({ title, conditions, onChange, values }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      border: "1px solid #ddd",
      borderRadius: 2,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      fontSize: {
        xs: "0.75rem",
        sm: "0.8rem",
        md: "0.9rem",
        lg: "1rem",
      },
    }}
  >
    <TitleBox>{title}</TitleBox>
    <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 0 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          {conditions.slice(0, 4).map((condition) => (
            <FormControlLabel
              key={condition.id}
              control={
                <Checkbox
                  checked={values?.[condition.id] || false}
                  onChange={onChange}
                  name={condition.id}
                />
              }
              label={condition.label}
              sx={{ display: "block", mb: 1 }}
            />
          ))}
        </Grid>
        <Grid item xs={6}>
          {conditions.slice(4).map((condition) => (
            <FormControlLabel
              key={condition.id}
              control={
                <Checkbox
                  checked={values?.[condition.id] || false}
                  onChange={onChange}
                  name={condition.id}
                />
              }
              label={condition.label}
              sx={{ display: "block", mb: 1 }}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [comparisonMode, setComparisonMode] = useState("OnevsOne");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [mentalHealth, setMentalHealth] = useState({});

  // 개인 vs 개인에서 직접 입력할 숫자를 저장할 상태
  const [customTarget, setCustomTarget] = useState("");
  const [savedTarget, setSavedTarget] = useState("");

  // Brush된 포인트 저장해 Chart2에 히스토그램 표시
  const [brushedPoints, setBrushedPoints] = useState([]);

  const handleModeChange = (event) => {
    setComparisonMode(event.target.value);
    setCustomTarget("");
    setSavedTarget("");
  };

  // feature mean/std 선택 로직
  const handleFeatureClick = (category, feature, stat) => {
    setSelectedFeatures((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.category === category &&
          item.feature === feature &&
          item.stat === stat
      );
      if (existingIndex > -1) {
        const newArray = [...prev];
        newArray.splice(existingIndex, 1);
        return newArray;
      }
      let newArray = [...prev];
      if (newArray.length === 2) {
        newArray.shift();
      }
      newArray.push({ category, feature, stat });
      return newArray;
    });
  };

  const handleMentalHealthChange = (event) => {
    const { name, checked } = event.target;
    setMentalHealth((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCustomTargetChange = (e) => {
    setCustomTarget(e.target.value);
  };

  const handleConfirmTarget = () => {
    const val = parseInt(customTarget, 10);
    if (val >= 1 && val <= 300) {
      setSavedTarget(val);
      alert(`선택하신 대상: ${val}`);
    } else {
      alert("1~300 사이의 숫자를 입력하세요.");
    }
  };

  const handleSaveResults = async () => {
    const dashboard = document.getElementById("dashboard-content");
    try {
      const canvas = await html2canvas(dashboard, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `dashboard-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } catch (error) {
      console.error("Screenshot failed:", error);
    }
  };

  // scatterplot에서 brush 이벤트가 발생하면 brushedPoints 업데이트
  const handleBrush = (points) => {
    setBrushedPoints(points);
  };

  // 상단 레이아웃 동적 계산
  let myBoxXs = 3;
  let groupBoxXs = 3;
  let showTargetSelect = true;
  let targetSelectXs = 4;
  let myBoxTitle = "나";
  let groupBoxTitle = "그룹";

  if (comparisonMode === "OnevsGroup") {
    showTargetSelect = false;
    myBoxXs = 5;
    groupBoxXs = 5;
  } else if (comparisonMode === "GroupvsGroup") {
    showTargetSelect = false;
    myBoxXs = 5;
    groupBoxXs = 5;
    myBoxTitle = "그룹1";
    groupBoxTitle = "그룹2";
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4F46E530, #10B98130)",
        width: "100%",
        pb: 4,
      }}
    >
      <Header />
      <Container maxWidth="false" sx={{ width: "100%", maxWidth: "1800px" }}>
        <Box sx={{ pt: 10 }}>
          <Paper
            id="dashboard-content"
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: "80vh",
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            {/* 전체 2개 row: 위 35%, 아래 65% */}
            <Grid container spacing={2} sx={{ flex: 1, height: "100%" }}>
              {/* 첫 번째 행(35%) */}
              <Grid item xs={12} sx={{ height: "35%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  {/* Comparison Mode (xs=2) */}
                  <Grid item xs={2} sx={{ height: "100%" }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* 제목 박스 */}
                      <Box
                        sx={{
                          backgroundColor: "#f0f0f0",
                          border: "2px solid #ccc",
                          borderRadius: 1,
                          textAlign: "center",
                          mb: 1,
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ m: 0, fontWeight: "bold" }}
                        >
                          Comparison Mode
                        </Typography>
                      </Box>
                      <FormControl
                        component="fieldset"
                        sx={{ flex: 1, overflowY: "auto" }}
                      >
                        <RadioGroup
                          value={comparisonMode}
                          onChange={handleModeChange}
                        >
                          <FormControlLabel
                            value="OnevsOne"
                            control={<Radio />}
                            label="개인 vs 개인"
                          />
                          <FormControlLabel
                            value="OnevsGroup"
                            control={<Radio />}
                            label="개인 vs 그룹"
                          />
                          <FormControlLabel
                            value="GroupvsGroup"
                            control={<Radio />}
                            label="그룹 vs 그룹"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* 나 or 그룹1 */}
                  <Grid item xs={myBoxXs} sx={{ height: "100%" }}>
                    <MentalHealthSection
                      title={myBoxTitle}
                      conditions={MENTAL_HEALTH_CONDITIONS}
                      onChange={handleMentalHealthChange}
                      values={mentalHealth}
                    />
                  </Grid>

                  {/* 대상 선택 박스 (OnevsOne 전용) */}
                  {showTargetSelect ? (
                    <Grid item xs={targetSelectXs} sx={{ height: "100%" }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          border: "1px solid #ddd",
                          borderRadius: 2,
                          height: "100%",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "#f0f0f0",
                            border: "2px solid #ccc",
                            borderRadius: 1,
                            textAlign: "center",
                            mb: 1,
                            py: 1,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ m: 0, fontWeight: "bold" }}
                          >
                            대상 선택
                          </Typography>
                        </Box>
                        <Box sx={{ overflowY: "auto", flex: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 2,
                              mb: 1,
                              fontWeight: "bold",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            1~300중에 비교하실 대상을 입력하세요
                          </Typography>
                          <TextField
                            type="number"
                            value={customTarget}
                            onChange={handleCustomTargetChange}
                            label="1~300 사이의 숫자 입력"
                            inputProps={{ min: 1, max: 300 }}
                            fullWidth
                            sx={{ mb: 2 }}
                          />
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={handleConfirmTarget}
                              size="small"
                            >
                              확인
                            </Button>
                          </Box>
                          {savedTarget && (
                            <Typography variant="body2" sx={{ mt: 2 }}>
                              선택된 대상: {savedTarget}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ) : null}

                  {/* 그룹 or 그룹2 */}
                  <Grid item xs={groupBoxXs} sx={{ height: "100%" }}>
                    <MentalHealthSection
                      title={groupBoxTitle}
                      conditions={MENTAL_HEALTH_CONDITIONS}
                      onChange={() => {}}
                      values={{}}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* 두 번째 행(65%) - Features / Chart1(Scatter) / Chart2(Histogram) */}
              <Grid item xs={12} sx={{ height: "65%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  {/* Features xs=2 */}
                  <Grid item xs={2} sx={{ height: "100%" }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#f0f0f0",
                          border: "2px solid #ccc",
                          borderRadius: 1,
                          textAlign: "center",
                          mb: 1,
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ m: 0, fontWeight: "bold" }}
                        >
                          Features
                        </Typography>
                      </Box>
                      <Box sx={{ overflowY: "auto", flex: 1 }}>
                        {FEATURE_TREE.map((group) => (
                          <Accordion key={group.category}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              {group.category}
                            </AccordionSummary>
                            <AccordionDetails>
                              {group.features.map((feature) => (
                                <Accordion key={feature}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    {feature}
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Button
                                      variant={
                                        selectedFeatures.some(
                                          (item) =>
                                            item.category === group.category &&
                                            item.feature === feature &&
                                            item.stat === "mean"
                                        )
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleFeatureClick(
                                          group.category,
                                          feature,
                                          "mean"
                                        )
                                      }
                                      sx={{
                                        mb: 1,
                                        width: "100%",
                                        textAlign: "left",
                                      }}
                                    >
                                      mean
                                    </Button>
                                    <Button
                                      variant={
                                        selectedFeatures.some(
                                          (item) =>
                                            item.category === group.category &&
                                            item.feature === feature &&
                                            item.stat === "std"
                                        )
                                          ? "contained"
                                          : "outlined"
                                      }
                                      onClick={() =>
                                        handleFeatureClick(
                                          group.category,
                                          feature,
                                          "std"
                                        )
                                      }
                                      sx={{
                                        mb: 1,
                                        width: "100%",
                                        textAlign: "left",
                                      }}
                                    >
                                      std
                                    </Button>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                              {group.features.length === 0 && (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  No features available.
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Chart1 (ScatterPlot) xs=5 */}
                  <Grid item xs={5} sx={{ height: "100%" }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* 제목 제거 → 더 넓게 ScatterPlot 차지 */}
                      <Box sx={{ flex: 1, position: "relative" }}>
                        <ScatterPlot
                          selectedFeatures={selectedFeatures}
                          brushedPoints={brushedPoints}
                          onBrush={handleBrush}
                        />
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Chart2 (HistogramPlot) xs=5 */}
                  <Grid item xs={5} sx={{ height: "100%" }}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        border: "1px solid #ddd",
                        borderRadius: 2,
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {/* 제목 제거 → HistogramPlot */}
                      <Box sx={{ flex: 1, position: "relative" }}>
                        <HistogramPlot brushedData={brushedPoints} />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* 결과 저장 버튼 */}
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleSaveResults}
              sx={{
                bgcolor: "#007BFF",
                color: "white",
                "&:hover": { bgcolor: "#0056b3" },
              }}
            >
              결과 저장
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;

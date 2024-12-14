import React, { useState, useEffect } from "react";
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
import data from "../data/phenotyping_data_with_label_v2.json";
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
  { id: "IGDS", label: "IGDS" },
  { id: "STAI-X-1", label: "STAI-X-1" },
  { id: "PHQ-9", label: "PHQ-9" },
  { id: "BIS-15", label: "BIS-15" },
  { id: "BPAQ", label: "BPAQ" },
  { id: "ASRS-V1.1", label: "ASRS-V1.1" },
  { id: "Y-BOCS", label: "Y-BOCS" },
  { id: "PQ-16", label: "PQ-16" },
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
const MentalHealthSection = ({ title, conditions, onChange, values, disabled=false }) => (
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
                  disabled={disabled}
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
                  disabled={disabled}
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
  const [mentalHealthGroup1, setMentalHealthGroup1] = useState({});
  const [mentalHealthGroup2, setMentalHealthGroup2] = useState({});
  const myStudentId = "student12067"; //일단 이걸로해!!!!!!!!!!!!!!!!!!!!!!!!!!

  // 개인 vs 개인에서 직접 입력할 숫자를 저장할 상태
  const [customTarget, setCustomTarget] = useState("");
  const [savedTarget, setSavedTarget] = useState("");

  // Brush된 포인트 저장해 Chart2에 히스토그램 표시
  const [brushedPoints, setBrushedPoints] = useState([]);

  const handleGroup1Change = (event) => {
    const { name, checked } = event.target;
    setMentalHealthGroup1((prev) => ({ ...prev, [name]: checked }));
  };
  const handleGroup2Change = (event) => {
    const { name, checked } = event.target;
    setMentalHealthGroup2((prev) => ({ ...prev, [name]: checked }));
  };

  useEffect(() => {
    const myStudent = data[myStudentId];
    if (myStudent) {
      const initMentalHealth = {};
      Object.keys(myStudent.labels).forEach((cond) => {
        initMentalHealth[cond] = myStudent.labels[cond] === 1; 
      });
      setMentalHealth(initMentalHealth);
    }
  }, [myStudentId]);

  // 그룹 조건에 맞게 학생 데이터를 필터링하는 함수
  const filterDataByMentalHealth = (mentalHealthObj) => {
    const selectedConditions = Object.keys(mentalHealthObj).filter(k => mentalHealthObj[k]);
    if (selectedConditions.length === 0) return [];
    const students = Object.values(data).filter(student => {
      const labels = student.labels;
      // 모든 선택된 척도를 만족하는 학생만
      return selectedConditions.every(cond => labels[cond] === 1);
    });
    return students;
  };

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
    // const { name, checked } = event.target;
    // setMentalHealth((prev) => ({
    //   ...prev,
    //   [name]: checked,
    // }));
  };

  const handleCustomTargetChange = (e) => {
    setCustomTarget(e.target.value);
  };

  let targetConditions = mentalHealthGroup2; // 혹은 대상자 섹션용 별도 state 필요
  const targetStudents = filterDataByMentalHealth(targetConditions);
  const maxCount = targetStudents.length > 0 ? targetStudents.length : 1;
  
  const handleConfirmTarget = () => {
    const val = parseInt(customTarget, 10);
    if (val >= 1 && val <= maxCount) {
      setSavedTarget(val);
      alert(`선택하신 대상: ${val}`);
    } else {
      alert(`1~${maxCount} 사이의 숫자를 입력하세요.`);
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
  const preparePlotData = (students, selectedFeatures) => {
    if (selectedFeatures.length < 2) return [];
    const [xFeature, yFeature] = selectedFeatures;
    return students.map(student => {
      const xVal = student[xFeature.category]?.[xFeature.feature]?.[xFeature.stat];
      const yVal = student[yFeature.category]?.[yFeature.feature]?.[yFeature.stat];
      if (xVal != null && yVal != null) {
        return { ...student, x: xVal, y: yVal };
      }
      return null;
    }).filter(d => d !== null);
  };

  // 모드별로 데이터 준비
  let scatterGroupData = []; // ScatterPlot에 넘길 groupData
  if (comparisonMode === "GroupvsGroup") {
    console.log("mentalHealthGroup1")
    console.log(mentalHealthGroup1)
    const group1Filtered = filterDataByMentalHealth(mentalHealthGroup1);
    const group2Filtered = filterDataByMentalHealth(mentalHealthGroup2);
    const group1Data = preparePlotData(group1Filtered, selectedFeatures);
    const group2Data = preparePlotData(group2Filtered, selectedFeatures);
    scatterGroupData = [
      { data: group1Data, color: 'steelblue' },
      { data: group2Data, color: 'black' }
    ];
  } else if (comparisonMode === "OnevsGroup") {
    const groupFiltered = filterDataByMentalHealth(mentalHealthGroup1); // 그룹1 역할 재사용 혹은 mentalHealth를 그룹조건으로 활용
    const groupData = preparePlotData(groupFiltered, selectedFeatures);
    // "나"의 단일 포인트
    // 나의 데이터는 별도 필터링 없이 student_id = myStudentId로 특정
    const myStudent = data[myStudentId];
    let myData = [];
    if (myStudent && selectedFeatures.length === 2) {
      const [xFeature, yFeature] = selectedFeatures;
      const xVal = myStudent[xFeature.category]?.[xFeature.feature]?.[xFeature.stat];
      const yVal = myStudent[yFeature.category]?.[yFeature.feature]?.[yFeature.stat];
      if (xVal != null && yVal != null) {
        myData = [{ ...myStudent, x: xVal, y: yVal }];
      }
    }
    scatterGroupData = [
      { data: groupData, color: 'steelblue' },
      // 나의 데이터: 큰 빨간 점 표시를 위해 radius 정보 추가
      { data: myData, color: 'red', radius: 10 }
    ];
  } else if (comparisonMode === "OnevsOne") {
    const myStudent = data[myStudentId];
    const myData = preparePlotData([myStudent], selectedFeatures);

    // savedTarget 대상자 필터링 (단일 student_id 가정)
    let targetData = [];
    if (savedTarget) {
      const targetId = `student${savedTarget}`;
      const targetStudent = data[targetId];
      targetData = preparePlotData([targetStudent], selectedFeatures);
    }
    scatterGroupData = [
      { data: myData, color: 'red', radius: 10 },
      { data: targetData, color: 'steelblue' }
    ];
  }

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
  const myPointX = (comparisonMode === "OnevsGroup" && scatterGroupData[1].data.length > 0)
    ? scatterGroupData[1].data[0].x
    : null;
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

                  {/* 모드별 UI 분기 */}
                  {comparisonMode === "OnevsOne" && (
                    <>
                      {/* 나 */}
                      <Grid item xs={3} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="나"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={() => {}} // 바꿀 수 없으니 빈 핸들러
                          values={mentalHealth}
                          disabled={true} // 이 props를 추가
                        />
                      </Grid>

                      {/* 대상 선택 박스 */}
                      <Grid item xs={4} sx={{ height: "100%" }}>
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
                            <Typography variant="h6" sx={{ m: 0, fontWeight: "bold" }}>
                              대상 선택
                            </Typography>
                          </Box>
                          <Box sx={{ overflowY: "auto", flex: 1 }}>
                            {/* <Typography
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
                            </Typography> */}
                            <TextField
                              type="number"
                              value={customTarget}
                              onChange={handleCustomTargetChange}
                              label={`1~${maxCount} 사이의 숫자 입력`} // maxCount 반영
                              inputProps={{ min: 1, max: maxCount }}
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

                      {/* 비교 대상 그룹(혹은 개인) - 여기서는 빈 체크박스 섹션 or 필요없으면 제거 */}
                      <Grid item xs={3} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="대상자"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup2Change} // 대상자 섹션 상태 관리
                          values={mentalHealthGroup2}
                        />
                      </Grid>
                    </>
                  )}

                  {comparisonMode === "OnevsGroup" && (
                    <>
                      {/* 나: disabled 처리 */}
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="나"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={() => {}} // 변경 불가
                          values={mentalHealth}
                          disabled={true}
                        />
                      </Grid>

                      {/* 그룹 */}
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="그룹"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup1Change}
                          values={mentalHealthGroup1}
                        />
                      </Grid>
                    </>
                  )}

                  {comparisonMode === "GroupvsGroup" && (
                    <>
                      {/* 그룹1 */}
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="그룹1"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup1Change}
                          values={mentalHealthGroup1}
                        />
                      </Grid>

                      {/* 그룹2 */}
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="그룹2"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup2Change}
                          values={mentalHealthGroup2}
                        />
                      </Grid>
                    </>
                  )}
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
                        onBrush={handleBrush}
                        groupData={scatterGroupData}
                        comparisonMode={comparisonMode}
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
                        <HistogramPlot brushedData={brushedPoints} myValue={myPointX}/>
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

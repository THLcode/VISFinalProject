// Dashboard.js
import React, { useState, useEffect, useContext } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";
import html2canvas from "html2canvas";
import ScatterPlot from "./Scatterplot";
import HistogramPlot from "./HistogramPlot";
import FeatureSelectionMatrixModal from "./FeatureSelectionMatrixModal"; // 추가
import data from "../data/phenotyping_data_with_label_v2.json";
import { UserContext } from "../UserContext";

// 박스에 제목 느낌을 주는 컴포넌트
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
export const FEATURE_TREE = [
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

// MentalHealthSection
const MentalHealthSection = ({
  title,
  conditions,
  onChange,
  values,
  disabled = false,
}) => (
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
      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.9rem", lg: "1rem" },
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
  const { user } = useContext(UserContext);
  const myStudentId = user?.student_id || "";

  // 브러시된 포인트
  const [brushedPoints, setBrushedPoints] = useState([]);

  // 개인 vs 개인
  const [customTarget, setCustomTarget] = useState("");
  const [savedTarget, setSavedTarget] = useState("");

  // Feature Selection 모달 오픈 state
  const [featureSelectionOpen, setFeatureSelectionOpen] = useState(false);

  useEffect(() => {
    // 내 mentalHealth (디폴트)
    const myStudent = data[myStudentId];
    if (myStudent) {
      const initMentalHealth = {};
      Object.keys(myStudent.labels).forEach((cond) => {
        initMentalHealth[cond] = myStudent.labels[cond] === 1;
      });
      setMentalHealth(initMentalHealth);
    }
  }, [myStudentId]);

  const handleGroup1Change = (e) => {
    const { name, checked } = e.target;
    setMentalHealthGroup1((prev) => ({ ...prev, [name]: checked }));
  };
  const handleGroup2Change = (e) => {
    const { name, checked } = e.target;
    setMentalHealthGroup2((prev) => ({ ...prev, [name]: checked }));
  };

  // 병에 맞게 학생 필터
  const filterDataByMentalHealth = (mentalHealthObj) => {
    // 체크된 병이 없으면 전체 데이터셋
    const selectedConditions = Object.keys(mentalHealthObj).filter(
      (k) => mentalHealthObj[k]
    );
    if (selectedConditions.length === 0) {
      return Object.values(data); // 전체
    }
    // 일부 병만
    return Object.values(data).filter((student) => {
      return selectedConditions.every((cond) => student.labels[cond] === 1);
    });
  };

  const handleModeChange = (event) => {
    setComparisonMode(event.target.value);
    setCustomTarget("");
    setSavedTarget("");
  };

  // feature mean/std
  const handleFeatureClick = (category, feature, stat) => {
    setSelectedFeatures((prev) => {
      const idx = prev.findIndex(
        (f) =>
          f.category === category && f.feature === feature && f.stat === stat
      );
      if (idx > -1) {
        // 이미 선택되어 있으면 제거
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      }
      // 새로 추가
      let newArr = [...prev];
      if (newArr.length === 2) newArr.shift();
      newArr.push({ category, feature, stat });
      return newArr;
    });
  };

  const handleCustomTargetChange = (e) => {
    setCustomTarget(e.target.value);
  };

  const handleConfirmTarget = () => {
    const val = parseInt(customTarget, 10);
    const group2Filtered = filterDataByMentalHealth(mentalHealthGroup2);
    const maxCount = group2Filtered.length > 0 ? group2Filtered.length : 1;
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
    } catch (err) {
      console.error("Screenshot failed:", err);
    }
  };

  // sizeVal 계산
  const computeSizeTooltip = (student, mentalHealthObj) => {
    const selectedConditions = Object.keys(mentalHealthObj).filter(
      (k) => mentalHealthObj[k]
    );
    if (selectedConditions.length === 0) {
      return { sizeVal: 0, tooltipData: [] };
    }
    let scaleValues = [];
    let tooltipData = [];
    selectedConditions.forEach((cond) => {
      const scaleKey = cond + "_scale";
      const scaleVal = student.labels?.[scaleKey] || 0;
      scaleValues.push(scaleVal);
      tooltipData.push({ condition: cond, scaleValue: scaleVal });
    });
    const maxScale = Math.max(...scaleValues);
    return { sizeVal: maxScale, tooltipData };
  };

  const preparePlotData = (students, selectedFeatures, mentalHealthObj) => {
    if (selectedFeatures.length < 2) return [];
    const [xF, yF] = selectedFeatures;
    return students
      .map((stu) => {
        const xVal = stu[xF.category]?.[xF.feature]?.[xF.stat];
        const yVal = stu[yF.category]?.[yF.feature]?.[yF.stat];
        if (xVal == null || yVal == null) return null;
        const { sizeVal, tooltipData } = computeSizeTooltip(
          stu,
          mentalHealthObj
        );
        return { ...stu, x: xVal, y: yVal, sizeVal, tooltipData };
      })
      .filter((d) => d !== null);
  };

  // 비교모드별 groupData
  let scatterGroupData = [];
  const group1Filtered = filterDataByMentalHealth(mentalHealthGroup1);
  const group2Filtered = filterDataByMentalHealth(mentalHealthGroup2);

  // group1Data, group2Data
  const group1Data = preparePlotData(
    group1Filtered,
    selectedFeatures,
    mentalHealthGroup1
  );
  const group2Data = preparePlotData(
    group2Filtered,
    selectedFeatures,
    mentalHealthGroup2
  );

  if (comparisonMode === "GroupvsGroup") {
    const selectedConditionsGroup1 = Object.keys(mentalHealthGroup1).filter(
      (k) => mentalHealthGroup1[k]
    );
    const selectedConditionsGroup2 = Object.keys(mentalHealthGroup2).filter(
      (k) => mentalHealthGroup2[k]
    );

    let group1Filtered =
      selectedConditionsGroup1.length === 0
        ? Object.values(data)
        : filterDataByMentalHealth(mentalHealthGroup1);

    let group2Filtered =
      selectedConditionsGroup2.length === 0
        ? Object.values(data)
        : filterDataByMentalHealth(mentalHealthGroup2);

    const group1Data = preparePlotData(
      group1Filtered,
      selectedFeatures,
      mentalHealthGroup1
    );
    const group2Data = preparePlotData(
      group2Filtered,
      selectedFeatures,
      mentalHealthGroup2
    );

    scatterGroupData = [
      { data: group1Data, color: "steelblue", groupId: "Group 1" },
      { data: group2Data, color: "orange", groupId: "Group 2" },
    ];
  } else if (comparisonMode === "OnevsGroup") {
    const myStudent = data[myStudentId];
    let myData = [];
    if (myStudent && selectedFeatures.length === 2) {
      myData = preparePlotData([myStudent], selectedFeatures, mentalHealth);
    }
    scatterGroupData = [
      { data: group1Data, color: "steelblue", groupId: "Group" },
      { data: myData, color: "red", radius: 10, groupId: "User" },
    ];
  } else if (comparisonMode === "OnevsOne") {
    const myStudent = data[myStudentId];
    let myData = [],
      targetData = [];
    if (myStudent && selectedFeatures.length === 2) {
      myData = preparePlotData([myStudent], selectedFeatures, mentalHealth);
    }
    if (savedTarget && selectedFeatures.length === 2) {
      if (savedTarget <= group2Filtered.length) {
        const chosen = group2Filtered[savedTarget - 1];
        targetData = preparePlotData(
          [chosen],
          selectedFeatures,
          mentalHealthGroup2
        );
      }
    }
    scatterGroupData = [
      { data: myData, color: "red", radius: 10, groupId: "User" },
      { data: targetData, color: "steelblue", groupId: "target" },
    ];
  }
  // === 여기에, 매트릭스 모달을 위한 별도 rawData 준비 ===
  const featureSelectionModalData = [];
  if (comparisonMode === "GroupvsGroup") {
    featureSelectionModalData.push(
      { data: group1Filtered, color: "steelblue", groupId: "group1" },
      { data: group2Filtered, color: "orange", groupId: "group2" }
    );
  } else if (comparisonMode === "OnevsGroup") {
    const myStudent = data[myStudentId];
    if (myStudent) {
      featureSelectionModalData.push({
        data: [myStudent],
        color: "red",
        groupId: "User",
      });
    }
    featureSelectionModalData.push({
      data: group1Filtered,
      color: "steelblue",
      groupId: "group",
    });
  } else if (comparisonMode === "OnevsOne") {
    const myStudent = data[myStudentId];
    if (myStudent) {
      featureSelectionModalData.push({
        data: [myStudent],
        color: "red",
        groupId: "User",
      });
    }
    // 선택된 n번째 타겟
    if (savedTarget && savedTarget <= group2Filtered.length) {
      featureSelectionModalData.push({
        data: [group2Filtered[savedTarget - 1]],
        color: "steelblue",
        groupId: "target",
      });
    }
  }

  const handleBrush = (points) => {
    setBrushedPoints(points);
  };

  // "나" 히스토그램 라인
  let myPointX = null;
  if (
    comparisonMode === "OnevsGroup" &&
    scatterGroupData[1]?.data?.length > 0
  ) {
    myPointX = scatterGroupData[1].data[0].x;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4F46E530, #10B98130)",
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
            <Grid container spacing={2} sx={{ flex: 1, height: "100%" }}>
              {/* 첫 번째 행(35%) */}
              <Grid item xs={12} sx={{ height: "35%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  {/* 모드 */}
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
                            label="Individual vs Individual"
                          />
                          <FormControlLabel
                            value="OnevsGroup"
                            control={<Radio />}
                            label="Individual vs Group"
                          />
                          <FormControlLabel
                            value="GroupvsGroup"
                            control={<Radio />}
                            label="Group vs Group"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Paper>
                  </Grid>

                  {/* 모드별 UI */}
                  {comparisonMode === "OnevsOne" && (
                    <>
                      <Grid item xs={3} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="User's Mental Health Assessment"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={() => {}}
                          values={mentalHealth}
                          disabled
                        />
                      </Grid>
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
                            <Typography
                              variant="h6"
                              sx={{ m: 0, fontWeight: "bold" }}
                            >
                              Choosing the target
                            </Typography>
                          </Box>
                          <Box sx={{ overflowY: "auto", flex: 1 }}>
                            <TextField
                              type="number"
                              value={customTarget}
                              onChange={handleCustomTargetChange}
                              label={`Choose between 1~${
                                group2Filtered.length || 1
                              }`}
                              fullWidth
                              sx={{ mt: 2, mb: 2 }}
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
                                Confirm
                              </Button>
                            </Box>
                            {/* {savedTarget && (
                              <Typography variant="body2" sx={{ mt: 2 }}>
                                선택된 대상: {savedTarget}
                              </Typography>
                            )} */}
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={3} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="Other's Mental Health Assessment"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup2Change}
                          values={mentalHealthGroup2}
                        />
                      </Grid>
                    </>
                  )}

                  {comparisonMode === "OnevsGroup" && (
                    <>
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="User's Mental Health Assessment"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={() => {}}
                          values={mentalHealth}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="Group 1"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup1Change}
                          values={mentalHealthGroup1}
                        />
                      </Grid>
                    </>
                  )}

                  {comparisonMode === "GroupvsGroup" && (
                    <>
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="Group 1"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup1Change}
                          values={mentalHealthGroup1}
                        />
                      </Grid>
                      <Grid item xs={5} sx={{ height: "100%" }}>
                        <MentalHealthSection
                          title="Group 2"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleGroup2Change}
                          values={mentalHealthGroup2}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              {/* 두 번째 행(65%) - Features / Chart1 / Chart2 */}
              <Grid item xs={12} sx={{ height: "65%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  {/* Features (xs=2) */}
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
                                          (f) =>
                                            f.category === group.category &&
                                            f.feature === feature &&
                                            f.stat === "mean"
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
                                          (f) =>
                                            f.category === group.category &&
                                            f.feature === feature &&
                                            f.stat === "std"
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

                      {/* FeatureSelection 모달 버튼 */}
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="outlined"
                          onClick={() => setFeatureSelectionOpen(true)}
                        >
                          Feature Selection
                        </Button>
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
                      <Box sx={{ flex: 1, position: "relative" }}>
                        <HistogramPlot
                          brushedData={brushedPoints}
                          myValue={myPointX}
                          comparisonMode={comparisonMode}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* 결과 저장 버튼 */}
          <Box sx={{ mt: 4, textAlign: "right" }}>
            <Button variant="contained" onClick={handleSaveResults}>
              Save
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Feature Selection 모달: 열 때마다 초기화 */}
      <FeatureSelectionMatrixModal
        open={featureSelectionOpen}
        onClose={() => setFeatureSelectionOpen(false)}
        groupData={featureSelectionModalData} // 필터링된 데이터
      />
    </Box>
  );
};

export default Dashboard;

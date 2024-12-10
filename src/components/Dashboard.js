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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Header from "./Header";
import html2canvas from "html2canvas";
import result1 from "../assets/result1.png";
import result2 from "../assets/result2.png";

// Constants for mental health conditions
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

// Constants for hierarchical features
const FEATURE_TREE = [
  {
    category: "ratio",
    features: [],
  },
  {
    category: "num_[key]_per_sec",
    features: [
      "num_language_per_sec",
      "num_backspace_per_sec",
      "num_space_per_sec",
      "num_shift_per_sec",
      "num_enter_per_sec",
      "num_punc_per_sec",
      "num_special_per_sec",
      "num_num_per_sec",
    ],
  },
  {
    category: "pause",
    features: [],
  },
  {
    category: "pressure",
    features: [
      "pressureMin_mean",
      "pressureMin_std",
      "pressureMax_mean",
      "pressureMax_std",
      "pressureAvg_mean",
      "pressureAvg_std",
    ],
  },
  {
    category: "area",
    features: [],
  },
];

// Constants for sample IDs
const SAMPLE_IDS = ["137", "458", "647", "723", "912", "1344", "1532", "2051"];

// Component for the mental health conditions section
const MentalHealthSection = ({ title, conditions, onChange, values }) => (
  <Paper
    elevation={1}
    sx={{
      p: 2,
      border: "1px solid #ddd",
      borderRadius: 2,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
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
  const [comparisonMode, setComparisonMode] = useState("개인vsGroup");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [mentalHealth, setMentalHealth] = useState({});

  const handleModeChange = (event) => {
    setComparisonMode(event.target.value);
  };

  const handleFeatureClick = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleIdClick = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleMentalHealthChange = (event) => {
    const { name, checked } = event.target;
    setMentalHealth((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
      <Container maxWidth="lg">
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
            <Grid container spacing={2} sx={{ flex: 1, overflow: "hidden" }}>
              {/* Left Sidebar */}
              <Grid item xs={12} md={2} sx={{ height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    gap: 2,
                  }}
                >
                  {/* Comparison Mode */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Comparison Mode
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={comparisonMode}
                        onChange={handleModeChange}
                      >
                        <FormControlLabel
                          value="개인vs개인"
                          control={<Radio />}
                          label="개인 vs 개인"
                        />
                        <FormControlLabel
                          value="개인vsGroup"
                          control={<Radio />}
                          label="개인 vs 그룹"
                        />
                        <FormControlLabel
                          value="그룹vs그룹"
                          control={<Radio />}
                          label="그룹 vs 그룹"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Paper>

                  {/* Features */}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      flex: 3,
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Features
                    </Typography>
                    <Box sx={{ overflowY: "auto", flex: 1 }}>
                      {FEATURE_TREE.map((group) => (
                        <Accordion key={group.category}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            {group.category}
                          </AccordionSummary>
                          <AccordionDetails>
                            {group.features.map((feature) => (
                              <Button
                                key={feature}
                                variant={
                                  selectedFeatures.includes(feature)
                                    ? "contained"
                                    : "outlined"
                                }
                                onClick={() => handleFeatureClick(feature)}
                                sx={{
                                  mb: 1,
                                  width: "100%",
                                  textAlign: "left",
                                }}
                              >
                                {feature}
                              </Button>
                            ))}
                            {group.features.length === 0 && (
                              <Typography variant="body2" color="textSecondary">
                                No features available.
                              </Typography>
                            )}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              </Grid>

              {/* Main Content */}
              <Grid item xs={12} md={10} sx={{ height: "100%" }}>
                <Grid container spacing={2} sx={{ height: "100%" }}>
                  <Grid item xs={12} sx={{ height: "50%" }}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                      <Grid item xs={12} md={4}>
                        <MentalHealthSection
                          title="나"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={handleMentalHealthChange}
                          values={mentalHealth}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            대상 선택
                          </Typography>
                          <Box sx={{ overflowY: "auto", flex: 1 }}>
                            {SAMPLE_IDS.map((id) => (
                              <Button
                                key={id}
                                variant={
                                  selectedId === id ? "contained" : "outlined"
                                }
                                onClick={() => handleIdClick(id)}
                                sx={{ mb: 1, width: "100%", textAlign: "left" }}
                              >
                                {id}
                              </Button>
                            ))}
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <MentalHealthSection
                          title="그룹"
                          conditions={MENTAL_HEALTH_CONDITIONS}
                          onChange={() => {}}
                          values={{}}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Charts */}
                  <Grid item xs={12} sx={{ height: "50%" }}>
                    <Grid container spacing={2} sx={{ height: "100%" }}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            Chart 1
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={result1}
                              alt="Chart 1"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="h6" gutterBottom>
                            Chart 2
                          </Typography>
                          <Box
                            sx={{
                              flex: 1,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={result2}
                              alt="Chart 2"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

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

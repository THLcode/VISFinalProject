// FeatureSelectionMatrixModal.js
import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import PairwiseScatterMatrix from "./PairwiseScatterMatrix";
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

const FeatureSelectionMatrixModal = ({ open, onClose, groupData = [] }) => {
  // 체크박스 선택된 원본 Feature들(최대 5개)
  const [selectedRawFeatures, setSelectedRawFeatures] = useState([]);
  const [finalFeatures, setFinalFeatures] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);

  // 모달 열릴 때마다 초기화
  useEffect(() => {
    if (open) {
      setSelectedRawFeatures([]);
      setFinalFeatures([]);
      setShowMatrix(false);
    }
  }, [open]);

  // Feature 전체 평면화
  const allRawFeatures = useMemo(() => {
    const arr = [];
    FEATURE_TREE.forEach((group) => {
      group.features.forEach((f) => {
        arr.push({ category: group.category, feature: f });
      });
    });
    return arr;
  }, []);

  const handleCheck = (fobj) => {
    setSelectedRawFeatures((prev) => {
      const exists = prev.find(
        (x) => x.category === fobj.category && x.feature === fobj.feature
      );
      if (exists) {
        // 해제
        return prev.filter((x) => x !== exists);
      } else {
        if (prev.length >= 5) {
          alert("최대 5개까지 선택 가능합니다.");
          return prev;
        }
        return [...prev, fobj];
      }
    });
  };

  const handleGenerateMatrix = () => {
    // Feature 0개 선택 가능 → PairwiseMatrix는 빈 메시지 표현
    setFinalFeatures(selectedRawFeatures);
    setShowMatrix(true);
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>Feature Selection (0 ~ 5)</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Choose up to 5 features to generate a pairwise matrix.
        </Typography>

        {/* 체크박스 목록 */}
        <div style={{ maxHeight: 200, overflow: "auto", marginBottom: 10 }}>
          {allRawFeatures.map((fobj, idx) => {
            const checked = selectedRawFeatures.some(
              (x) => x.category === fobj.category && x.feature === fobj.feature
            );
            return (
              <FormControlLabel
                key={idx}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => handleCheck(fobj)}
                  />
                }
                label={`${fobj.category}.${fobj.feature}`}
                sx={{ display: "block", mb: 1 }}
              />
            );
          })}
        </div>

        <Button
          variant="contained"
          onClick={handleGenerateMatrix}
          sx={{ mb: 2 }}
        >
          Generate Matrix
        </Button>

        {showMatrix && (
          <>
            {finalFeatures.length === 0 ? (
              <Typography variant="subtitle1" color="error">
                Feature를 선택하지 않았습니다. (빈 그래프 대신 안내 메시지)
              </Typography>
            ) : (
              <>
                {/* <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  선택된 {finalFeatures.length}개 Feature → Pairwise Matrix
                </Typography> */}
                <PairwiseScatterMatrix
                  groupData={groupData} // 필터링+색상 세팅된 데이터
                  featureList={finalFeatures}
                  useMeanAndStd={true}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeatureSelectionMatrixModal;

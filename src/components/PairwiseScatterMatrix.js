// PairwiseScatterMatrix.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

/**
 * groupData: [{ data: [...], color:'red', groupId:'my' }, { data: [...], color:'steelblue', groupId:'group1' }, ...]
 * featureList: [{ category:'pause', feature:'pause_3sec'}, ...] (useMeanAndStd=false일 땐 mean만)
 * useMeanAndStd: boolean - true면 mean/std 둘 다
 */
const PairwiseScatterMatrix = ({
  groupData = [],
  featureList = [],
  useMeanAndStd = false,
}) => {
  const containerRef = useRef(null);

  // subFeatures: featureList × (mean,std?)
  let subFeatures = [];
  featureList.forEach((f) => {
    if (useMeanAndStd) {
      subFeatures.push({
        category: f.category,
        feature: f.feature,
        stat: "mean",
      });
      subFeatures.push({
        category: f.category,
        feature: f.feature,
        stat: "std",
      });
    } else {
      subFeatures.push({
        category: f.category,
        feature: f.feature,
        stat: "mean",
      });
    }
  });

  const n = subFeatures.length;
  const CELL_SIZE = 100;
  const width = CELL_SIZE * n;
  const height = CELL_SIZE * n;

  useEffect(() => {
    const parent = d3.select(containerRef.current);
    parent.selectAll("*").remove();

    if (!groupData || groupData.length === 0) return;
    if (n === 0) {
      // Feature가 선택되지 않았으면 빈 그래프 대신 안내 (이미 Modal에서 안내 중)
      return;
    }

    const svg = parent
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const allPoints = groupData.flatMap((g) => g.data);

    // 각 subFeature별 scale
    const scales = {};
    subFeatures.forEach((sf) => {
      const vals = allPoints
        .map((d) => d[sf.category]?.[sf.feature]?.[sf.stat])
        .filter((v) => v != null);
      const domain = d3.extent(vals);
      const scale = d3
        .scaleLinear()
        .domain(domain)
        .range([5, CELL_SIZE - 5]);
      const key = `${sf.category}_${sf.feature}_${sf.stat}`;
      scales[key] = scale;
    });

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const gCell = svg
          .append("g")
          .attr(
            "transform",
            `translate(${col * CELL_SIZE},${row * CELL_SIZE})`
          );

        if (row === col) {
          gCell
            .append("rect")
            .attr("width", CELL_SIZE)
            .attr("height", CELL_SIZE)
            .attr("fill", "#fafafa")
            .attr("stroke", "#ccc");
          const label = `${subFeatures[row].feature}.${subFeatures[row].stat}`;
          gCell
            .append("text")
            .attr("x", CELL_SIZE / 2)
            .attr("y", CELL_SIZE / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-size", "10px")
            .text(label);
          continue;
        } else {
          gCell
            .append("rect")
            .attr("width", CELL_SIZE)
            .attr("height", CELL_SIZE)
            .attr("fill", "none")
            .attr("stroke", "#ccc");
        }

        const sfY = subFeatures[row];
        const sfX = subFeatures[col];
        const scaleX = scales[`${sfX.category}_${sfX.feature}_${sfX.stat}`];
        const scaleY = scales[`${sfY.category}_${sfY.feature}_${sfY.stat}`];
        if (!scaleX || !scaleY) continue;

        groupData.forEach((group, gIdx) => {
          const defaultR = group.radius || 3;
          gCell
            .selectAll(`.cell-circle-g${gIdx}-r${row}-c${col}`)
            .data(group.data)
            .enter()
            .append("circle")
            .attr("class", `cell-circle-g${gIdx}-r${row}-c${col}`)
            .attr("cx", (d) => {
              const val = d[sfX.category]?.[sfX.feature]?.[sfX.stat];
              return val != null ? scaleX(val) : -999;
            })
            .attr("cy", (d) => {
              const val = d[sfY.category]?.[sfY.feature]?.[sfY.stat];
              return val != null ? scaleY(val) : -999;
            })
            .attr("r", (d) =>
              group.groupId === "my" ? group.radius || 6 : defaultR
            )
            .attr("fill", group.color || "steelblue")
            .attr("opacity", group.groupId === "my" ? 0.9 : 0.5);
        });
      }
    }
  }, [groupData, featureList, useMeanAndStd]);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #ccc",
        overflow: "auto",
      }}
    />
  );
};

export default PairwiseScatterMatrix;

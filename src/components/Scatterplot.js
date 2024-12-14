// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// const ScatterPlot = ({
//   groupData = [],
//   selectedFeatures,
//   comparisonMode,
//   onBrush,
// }) => {
//   const svgRef = useRef(null);
//   useEffect(() => {
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();

//     const width = 600;
//     const height = 550;
//     const margin = 40;
//     const innerWidth = width - margin * 2;
//     const innerHeight = height - margin * 2;
//     svg.attr("width", width).attr("height", height);

//     if (selectedFeatures.length < 2) return;

//     const combinedData = groupData.flatMap((g) => g.data);
//     if (combinedData.length === 0) return;

//     const xScale = d3
//       .scaleLinear()
//       .domain(d3.extent(combinedData, (d) => d.x))
//       .nice()
//       .range([margin, margin + innerWidth]);

//     const yScale = d3
//       .scaleLinear()
//       .domain(d3.extent(combinedData, (d) => d.y))
//       .nice()
//       .range([margin + innerHeight, margin]);

//     const xAxis = d3.axisBottom(xScale);
//     const yAxis = d3.axisLeft(yScale);

//     svg
//       .append("g")
//       .attr("transform", `translate(0, ${margin + innerHeight})`)
//       .call(xAxis);

//     svg.append("g").attr("transform", `translate(${margin},0)`).call(yAxis);

//     // 그룹 데이터 그리기
//     groupData.forEach((group, i) => {
//       const radius = group.radius || 5;
//       const pointsWithGroupId = group.data.map((d) => ({
//         ...d,
//         groupId: group.groupId,
//       }));
//       svg
//         .selectAll(`.circle-group-${i}`)
//         .data(pointsWithGroupId)
//         .enter()
//         .append("circle")
//         .attr("class", `circle-group-${i}`)
//         .attr("cx", (d) => xScale(d.x))
//         .attr("cy", (d) => yScale(d.y))
//         .attr("r", radius)
//         .attr("fill", group.color)
//         .attr("opacity", 0.5);
//     });
//     const legend = svg
//       .append("g")
//       .attr("class", "legend")
//       .attr("transform", `translate(${width - margin - 150}, ${margin})`); // 레전드 위치 조정

//     groupData.forEach((group, i) => {
//       const legendRow = legend
//         .append("g")
//         .attr("class", "legend-row")
//         .attr("transform", `translate(0, ${i * 20})`); // 각 행 간격

//       // 색상 사각형
//       legendRow
//         .append("rect")
//         .attr("width", 15)
//         .attr("height", 15)
//         .attr("fill", group.color)
//         .attr("opacity", 0.5);

//       // 텍스트
//       legendRow
//         .append("text")
//         .attr("x", 20)
//         .attr("y", 12)
//         .attr("fill", "black")
//         .style("font-size", "12px")
//         .text(group.groupId || `Group ${i + 1}`); // 그룹 이름 표시
//     });

//     // Brush
//     if (onBrush) {
//       const brush = d3
//         .brush()
//         .extent([
//           [margin, margin],
//           [margin + innerWidth, margin + innerHeight],
//         ])
//         .on("end", (event) => {
//           if (!event.selection) {
//             onBrush([]);
//             return;
//           }
//           const [[x0, y0], [x1, y1]] = event.selection;

//           // 브러시 영역 내 포인트 필터링 시 groupData를 다시 한 번 순회
//           const brushedPoints = groupData.flatMap((g) => {
//             const pointsWithGroupId = g.data.map((d) => ({
//               ...d,
//               groupId: g.groupId,
//             }));
//             return pointsWithGroupId.filter((d) => {
//               const cx = xScale(d.x);
//               const cy = yScale(d.y);
//               return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
//             });
//           });
//           onBrush(brushedPoints);
//         });

//       svg.append("g").attr("class", "brush").call(brush);
//     }
//   }, [groupData, selectedFeatures, comparisonMode, onBrush]);

//   return <svg ref={svgRef} />;
// };

// export default ScatterPlot;

// // import React, { useRef, useEffect } from "react";
// // import * as d3 from "d3";

// // const ScatterPlot = ({ groupData = [], selectedFeatures, comparisonMode, onBrush }) => {
// //   const svgRef = useRef(null);

// //   useEffect(() => {
// //     const svg = d3.select(svgRef.current);
// //     svg.selectAll("*").remove();

// //     const width = 600;
// //     const height = 550;
// //     const margin = 40;
// //     const innerWidth = width - margin * 2;
// //     const innerHeight = height - margin * 2;
// //     svg.attr("width", width).attr("height", height);

// //     if (selectedFeatures.length < 2) return;

// //     const combinedData = groupData.flatMap((g) => g.data);
// //     if (combinedData.length === 0) return;

// //     const xScale = d3.scaleLinear()
// //       .domain(d3.extent(combinedData, (d) => d.x))
// //       .nice()
// //       .range([margin, margin + innerWidth]);

// //     const yScale = d3.scaleLinear()
// //       .domain(d3.extent(combinedData, (d) => d.y))
// //       .nice()
// //       .range([margin + innerHeight, margin]);

// //     const xAxis = d3.axisBottom(xScale);
// //     const yAxis = d3.axisLeft(yScale);

// //     svg.append("g")
// //       .attr("transform", `translate(0, ${margin + innerHeight})`)
// //       .call(xAxis);

// //     svg.append("g")
// //       .attr("transform", `translate(${margin},0)`)
// //       .call(yAxis);

// //     // 그룹 데이터와 등고선 그리기
// //     groupData.forEach((group, i) => {
// //       const radius = group.radius || 5;

// //       // 각 그룹 데이터 그리기
// //       svg.selectAll(`.circle-group-${i}`)
// //         .data(group.data)
// //         .enter()
// //         .append("circle")
// //         .attr("class", `circle-group-${i}`)
// //         .attr("cx", (d) => xScale(d.x))
// //         .attr("cy", (d) => yScale(d.y))
// //         .attr("r", radius)
// //         .attr("fill", group.color)
// //         .attr("opacity", 0.5);

// //       // 그룹별 등고선 계산
// //       const contourData = group.data.map((d) => [xScale(d.x), yScale(d.y)]);
// //       const density = d3
// //         .contourDensity()
// //         .x((d) => d[0])
// //         .y((d) => d[1])
// //         .size([width, height])
// //         .bandwidth(30)(contourData); // 밀도 대역폭 설정 (필요시 조정)

// //       // 그룹별 등고선 추가
// //       svg.append("g")
// //         .selectAll("path")
// //         .data(density)
// //         .enter()
// //         .append("path")
// //         .attr("d", d3.geoPath())
// //         .attr("fill", "none")
// //         .attr("stroke", group.color) // 그룹 색상 적용
// //         .attr("stroke-width", 2)
// //         .attr("stroke-opacity", 0.3);
// //     });

// //     // 레전드 추가
// //     const legend = svg
// //       .append("g")
// //       .attr("class", "legend")
// //       .attr("transform", `translate(${width - margin - 100}, ${margin})`);

// //     groupData.forEach((group, i) => {
// //       const legendRow = legend
// //         .append("g")
// //         .attr("class", "legend-row")
// //         .attr("transform", `translate(0, ${i * 20})`);

// //       // 색상 사각형
// //       legendRow
// //         .append("rect")
// //         .attr("width", 15)
// //         .attr("height", 15)
// //         .attr("fill", group.color)
// //         .attr("opacity", 0.8);

// //       // 텍스트
// //       legendRow
// //         .append("text")
// //         .attr("x", 20)
// //         .attr("y", 12)
// //         .attr("fill", "black")
// //         .style("font-size", "12px")
// //         .text(group.groupId || `Group ${i + 1}`);
// //     });

// //     // Brush
// //     if (onBrush) {
// //       const brush = d3
// //         .brush()
// //         .extent([[margin, margin], [margin + innerWidth, margin + innerHeight]])
// //         .on("end", (event) => {
// //           if (!event.selection) {
// //             onBrush([]);
// //             return;
// //           }
// //           const [[x0, y0], [x1, y1]] = event.selection;

// //           const brushedPoints = groupData.flatMap((g) =>
// //             g.data.filter((d) => {
// //               const cx = xScale(d.x);
// //               const cy = yScale(d.y);
// //               return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
// //             })
// //           );
// //           onBrush(brushedPoints);
// //         });

// //       svg.append("g").attr("class", "brush").call(brush);
// //     }
// //   }, [groupData, selectedFeatures, comparisonMode, onBrush]);

// //   return <svg ref={svgRef} />;
// // };

// // export default ScatterPlot;
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterPlot = ({
  groupData = [],
  selectedFeatures,
  comparisonMode,
  onBrush,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 550;
    const margin = 40;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;
    svg.attr("width", width).attr("height", height);

    if (selectedFeatures.length < 2) return;

    // 모든 그룹 데이터를 합침
    const combinedData = groupData.flatMap((g) => g.data);
    if (combinedData.length === 0) return;

    // X, Y 스케일
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(combinedData, (d) => d.x))
      .nice()
      .range([margin, margin + innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(combinedData, (d) => d.y))
      .nice()
      .range([margin + innerHeight, margin]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${margin + innerHeight})`)
      .call(xAxis);

    svg.append("g").attr("transform", `translate(${margin},0)`).call(yAxis);

    // size 스케일 (값이 큰 사람은 큰 원)
    const sizeExtent = d3.extent(combinedData, (d) => d.sizeVal);
    const sizeScale = d3
      .scaleLinear()
      .domain([sizeExtent[0] || 0, sizeExtent[1] || 0])
      .range([3, 15]);

    // 그룹별 circle
    groupData.forEach((group, i) => {
      const defaultRadius = group.radius || 5;

      const circles = svg
        .selectAll(`.circle-group-${i}`)
        .data(group.data)
        .enter()
        .append("circle")
        .attr("class", `circle-group-${i}`)
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", (d) =>
          d.sizeVal !== undefined ? sizeScale(d.sizeVal) : defaultRadius
        )
        .attr("fill", group.color)
        .attr("opacity", 0.7);

      // 마우스오버 툴팁(간단히)
      circles.on("mouseover", (event, d) => {
        // 선택적으로 tooltip div 만들어 사용 가능, 간단히 콘솔 로그로 대체
        console.log("MouseOver:", d.student_id, "sizeVal:", d.sizeVal);
      });
    });

    // ---- (3) 회귀선(Regression Line) 표시 ----
    // 간단한 1차원 선형회귀 (OLS) 구현
    const n = combinedData.length;
    if (n > 1) {
      const meanX = d3.mean(combinedData, (d) => d.x);
      const meanY = d3.mean(combinedData, (d) => d.y);

      let numerator = 0;
      let denominator = 0;
      combinedData.forEach((d) => {
        numerator += (d.x - meanX) * (d.y - meanY);
        denominator += (d.x - meanX) ** 2;
      });
      const slope = denominator === 0 ? 0 : numerator / denominator;
      const intercept = meanY - slope * meanX;

      // 회귀선을 xDomain 범위 전체에 걸쳐 그린다
      const [xMin, xMax] = d3.extent(combinedData, (d) => d.x);
      const line = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));

      const regressionPoints = [
        { x: xMin, y: slope * xMin + intercept },
        { x: xMax, y: slope * xMax + intercept },
      ];

      svg
        .append("path")
        .datum(regressionPoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    // 범례
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - margin - 150}, ${margin})`);

    groupData.forEach((group, i) => {
      const legendRow = legend
        .append("g")
        .attr("class", "legend-row")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", group.color)
        .attr("opacity", 0.5);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", "black")
        .style("font-size", "12px")
        .text(group.groupId || `Group ${i + 1}`);
    });

    // Brush
    if (onBrush) {
      const brush = d3
        .brush()
        .extent([
          [margin, margin],
          [margin + innerWidth, margin + innerHeight],
        ])
        .on("end", (event) => {
          if (!event.selection) {
            onBrush([]);
            return;
          }
          const [[x0, y0], [x1, y1]] = event.selection;
          const brushedPoints = groupData.flatMap((g) => {
            return g.data.filter((d) => {
              const cx = xScale(d.x);
              const cy = yScale(d.y);
              return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
            });
          });
          onBrush(brushedPoints);
        });
      svg.append("g").attr("class", "brush").call(brush);
    }
  }, [groupData, selectedFeatures, comparisonMode, onBrush]);

  return <svg ref={svgRef} />;
};

export default ScatterPlot;

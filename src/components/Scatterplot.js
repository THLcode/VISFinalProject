import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "../data/phenotyping_data_v1.json";

const Scatterplot = ({ selectedFeatures, brushedPoints, onBrush }) => {
    console.log(selectedFeatures);
    const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 600;
    const margin = 30;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;
    svg.attr("width", width).attr("height", height);

    if (selectedFeatures.length < 2) {
        return; // 2개 미만이면 그래프를 그릴 수 없음
    }
    const xFeature = selectedFeatures[0];
    const yFeature = selectedFeatures[1];
    const students = Object.values(data);
    const plotData = students.map((student) => {
        const xVal = student[xFeature.category]?.[xFeature.feature]?.[xFeature.stat];
        const yVal = student[yFeature.category]?.[yFeature.feature]?.[yFeature.stat];
        return {
        student_id: student.student_id,
        x: xVal,
        y: yVal
        };
    }).filter(d => d.x != null && d.y != null); // null/undefined 값 필터링

    if (plotData.length === 0) {
        // 사용할 수 있는 데이터가 없으면 리턴
        return;
    }
    const xScale = d3.scaleLinear()
    .domain(d3.extent(plotData, d => d.x))
    .nice()
    .range([margin, margin + innerWidth]);

    const yScale = d3.scaleLinear()
    .domain(d3.extent(plotData, d => d.y))
    .nice()
    .range([margin + innerHeight, margin]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
    .attr("transform", `translate(0, ${margin + innerHeight})`)
    .call(xAxis);

    svg.append("g")
    .attr("transform", `translate(${margin},0)`)
    .call(yAxis);

    svg.append("text")
    .attr("x", margin + innerWidth / 2)
    .attr("y", margin + innerHeight + 40)
    .attr("text-anchor", "middle")
    .text(`${xFeature.category}/${xFeature.feature}/${xFeature.stat}`);

    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin + innerHeight / 2))
    .attr("y", margin - 40)
    .attr("text-anchor", "middle")
    .text(`${yFeature.category}/${yFeature.feature}/${yFeature.stat}`);

    // 점 찍기
    svg.selectAll("circle")
    .data(plotData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.x))
    .attr("cy", d => yScale(d.y))
    .attr("r", 4)
    .attr("fill", "steelblue")
    .attr("opacity", 0.7);

    if (onBrush) {
        const brush = d3.brush()
          .extent([[margin, margin], [margin + innerWidth, margin + innerHeight]])
          .on("end", (event) => {
            if (!event.selection) {
              onBrush([]); // 선택 해제 시 빈 배열
              return;
            }
  
            const [[x0, y0], [x1, y1]] = event.selection;
            const brushed = plotData.filter(d => {
              const cx = xScale(d.x);
              const cy = yScale(d.y);
              return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
            });
  
            onBrush(brushed);
          });
  
        svg.append("g")
          .attr("class", "brush")
          .call(brush);
      }

    }, [selectedFeatures, brushedPoints, onBrush]);

  return <svg ref={svgRef}></svg>;
};

export default Scatterplot;

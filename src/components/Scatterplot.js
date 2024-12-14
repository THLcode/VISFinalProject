import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ScatterPlot = ({ groupData = [], selectedFeatures, comparisonMode, onBrush }) => {
  const svgRef = useRef(null);
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 600;
    const margin = 40;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;
    svg.attr("width", width).attr("height", height);

    if (selectedFeatures.length < 2) return;
    
    const combinedData = groupData.flatMap(g => g.data);
    if (combinedData.length === 0) return;

    const xScale = d3.scaleLinear()
      .domain(d3.extent(combinedData, d => d.x))
      .nice()
      .range([margin, margin + innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(combinedData, d => d.y))
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

    // 그룹 데이터 그리기
    groupData.forEach((group, i) => {
      const radius = group.radius || 5;
      const pointsWithGroupId = group.data.map(d => ({ ...d, groupId: group.groupId }));
      svg.selectAll(`.circle-group-${i}`)
      .data(pointsWithGroupId)
        .enter()
        .append("circle")
        .attr("class", `circle-group-${i}`)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", radius)
        .attr("fill", group.color)
        .attr("opacity", 0.5);
    });
    

    // Brush
    if (onBrush) {
      const brush = d3.brush()
        .extent([[margin, margin], [margin + innerWidth, margin + innerHeight]])
        .on("end", (event) => {
          if (!event.selection) {
            onBrush([]);
            return;
          }
          const [[x0, y0], [x1, y1]] = event.selection;
          
          // 브러시 영역 내 포인트 필터링 시 groupData를 다시 한 번 순회
          const brushedPoints = groupData.flatMap((g) => {
            const pointsWithGroupId = g.data.map(d => ({ ...d, groupId: g.groupId }));
            return pointsWithGroupId.filter(d => {
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

// src/components/HistogramPlot.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const HistogramPlot = ({ brushedData }) => {
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

    if (!brushedData || brushedData.length === 0) {
      // brushedData가 없으면 표시하지 않음
      return;
    }
    // x, y 둘 중 하나만 히스토그램 할지? 가령 x값 분포만 보겠다
    // 또는 x와 y를 모두 히스토그램 2개로 그릴 수도 있음
    // 예시에선 x값 분포를 히스토그램으로 표시
    const values = brushedData.map((d) => d.x);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(values))
      .nice()
      .range([margin, margin + innerWidth]);

    const bins = d3.histogram().domain(xScale.domain()).thresholds(20)(values);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([margin + innerHeight, margin]);

    // X축
    const xAxis = d3.axisBottom(xScale);

    svg
      .append("g")
      .attr("transform", `translate(0, ${margin + innerHeight})`)
      .call(xAxis);

    // Y축
    const yAxis = d3.axisLeft(yScale).ticks(
      Math.min(
        d3.max(bins, (d) => d.length),
        10
      )
    );

    svg.append("g").attr("transform", `translate(${margin}, 0)`).call(yAxis);

    // 히스토그램 막대
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.x0))
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr("height", (d) => margin + innerHeight - yScale(d.length))
      .attr("fill", "steelblue")
      .attr("opacity", 0.7);
  }, [brushedData]);

  return <svg ref={svgRef} />;
};

export default HistogramPlot;

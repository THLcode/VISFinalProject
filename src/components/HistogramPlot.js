import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const HistogramPlot = ({ brushedData, myValue, comparisonMode }) => {
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

    if (!brushedData || brushedData.length === 0) {
      // brushedData가 없으면 표시하지 않음
      return;
    }

    // GroupvsGroup 모드일 때 그룹별로 데이터 나누기
    let groups = [];
    if (comparisonMode === "GroupvsGroup") {
      const group1Data = brushedData.filter(d => d.groupId === 'group1');
      const group2Data = brushedData.filter(d => d.groupId === 'group2');
      console.log("brushedData")
      console.log(brushedData)
      groups = [
        {id: 'group1', color: 'steelblue', values: group1Data.map(d=>d.x)},
        {id: 'group2', color: 'orange', values: group2Data.map(d=>d.x)}
      ];
    } else {
      // 그 외 모드는 단일 데이터셋(전체 brushedData) 기준
      groups = [
        {id: 'all', color: 'steelblue', values: brushedData.map(d=>d.x)}
      ];
    }

    // 전체 값 domain 계산(모든 그룹 값 통합)
    const allValues = groups.flatMap(g => g.values);

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(allValues))
      .nice()
      .range([margin, margin + innerWidth]);

    // 각 그룹별로 bin 계산
    // bins을 그룹별로 다르게 계산할 수도 있지만,
    // 동일한 bin 경계를 사용하려면 하나의 threshold 공유
    const binsGenerator = d3.histogram()
      .domain(xScale.domain())
      .thresholds(20);

    // 각 그룹에 대해 bin 계산
    groups.forEach(g => {
      g.bins = binsGenerator(g.values);
    });

    // Y 스케일은 모든 그룹의 bin 최대 높이 기준
    const maxCount = d3.max(groups.flatMap(g => g.bins.map(bin => bin.length)));
    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount])
      .nice()
      .range([margin + innerHeight, margin]);

    // X축
    const xAxis = d3.axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", `translate(0, ${margin + innerHeight})`)
      .call(xAxis);

    // Y축
    const yAxis = d3.axisLeft(yScale).ticks(Math.min(maxCount, 10));
    svg.append("g").attr("transform", `translate(${margin}, 0)`).call(yAxis);

    // 히스토그램 막대 그리기
    // 그룹이 2개 이상이면 오버레이 형태로 그려보자.
    // 각 bin.x0, bin.x1 은 동일하므로 같은 위치에 다른 색의 막대가 겹친다.
    // 투명도를 조절하거나 폭을 약간 조정해서 옆으로 밀 수도 있다.
    const barWidthAdjust = groups.length > 1 ? 0.4 : 0; 
    // group index에 따라 막대를 좌우로 약간 밀어내기
    groups.forEach((g, i) => {
      svg.selectAll(`rect.${g.id}`)
        .data(g.bins)
        .enter()
        .append("rect")
        .attr("class", g.id)
        .attr("x", (d) => xScale(d.x0) + (i * barWidthAdjust))
        .attr("y", (d) => yScale(d.length))
        .attr("width", (d) => {
          const w = xScale(d.x1) - xScale(d.x0) - 1;
          return Math.max(0, w - barWidthAdjust * (groups.length - 1));
        })
        .attr("height", (d) => margin + innerHeight - yScale(d.length))
        .attr("fill", g.color)
        .attr("opacity", 0.5); // 그룹별로 다른 불투명도
    });

    // 나의 위치 표시
    if (myValue != null) {
      const lineX = xScale(myValue);
      if (!isNaN(lineX)) {
        svg.append("line")
          .attr("x1", lineX)
          .attr("x2", lineX)
          .attr("y1", margin)
          .attr("y2", margin + innerHeight)
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("opacity", 0.9);
      }
    }
  }, [brushedData, myValue, comparisonMode]);

  return <svg ref={svgRef} />;
};

export default HistogramPlot;

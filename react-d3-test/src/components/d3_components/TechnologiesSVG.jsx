import * as d3 from "d3";
import { useEffect, useRef } from "react";
import nodesData from "../../data/technologies.json";

const TechnologiesSVG = (props) => {
  const ref = useRef();

  const width = props.parentWidth;
  const height = 500;
  const base_r = 50;
  const yearStart = 2025;
  const factor = 3;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    let node = svg
      .selectAll("g.node")
      .data(nodesData.nodes)
      .join("g")
      .attr("class", "node");

    const links = [];
    for (let i = 0; i < nodesData.nodes.length; i++) {
      for (let j = i + 1; j < nodesData.nodes.length; j++) {
        links.push({ source: nodesData.nodes[i], target: nodesData.nodes[j] });
      }
    }

    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.3);

    node.each(function (d) {
      const g = d3.select(this);
      g.selectAll("circle")
        .data([
          { data: d, type: "body" },
          { data: d, type: "marketsize" },
        ])
        .join("circle")
        .attr("r", (d) => {
          return d.type === "marketsize"
            ? d.data["2025"] / (2 * Math.PI * factor)
            : base_r;
        })
        .style("fill", (d) => (d.type === "body" ? "#69b3a2" : "none"))
        .style("stroke", (d) => (d.type === "body" ? "none" : "#000000"));

      g.selectAll("text")
        .data([d])
        .join("text")
        .text((d) => d.name)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");
    });

    let simulation = d3
      .forceSimulation(nodesData.nodes)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("link", d3.forceLink(links).strength(0.005))
      .force("collide", d3.forceCollide().radius(80).iterations(2))
      .force("y", d3.forceY(height / 2).strength(0.02));

    simulation.on("tick", () => {
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    });

    // Slider setup
    const sliderPadding = 50;
    const sliderWidth = width - 2 * sliderPadding;
    const sliderY = height - 40;
    let currentYear = yearStart;

    const yearScale = d3
      .scaleLinear()
      .domain([yearStart, 2030])
      .range([sliderPadding, sliderPadding + sliderWidth])
      .clamp(true);

    // Create or update slider group
    const sliderGroup = svg
      .selectAll("g.slider")
      .data([null])
      .join("g")
      .attr("class", "slider");

    // Draw slider track
    sliderGroup
      .selectAll("line.track")
      .data([{ type: "visible" }, { type: "invisible" }])
      .join("line")
      .attr("class", "track")
      .attr("x1", sliderPadding)
      .attr("x2", sliderPadding + sliderWidth)
      .attr("y1", sliderY)
      .attr("y2", sliderY)
      .attr("stroke", "#ccc")
      .attr("stroke-width", (d) => (d.type === "visible" ? 3 : 6))
      .attr("opacity", (d) => (d.type === "visible" ? 1 : 0))
      .attr("cursor", "pointer")
      .on("click", function (event) {
        handleClickorDrag(event);
      })
      .on("mouseover", (e) => {
        d3.select(this).raise();
      });

    // Draw ticks for each year
    const tickData = d3.range(yearStart, 2031);
    sliderGroup
      .selectAll("line.tick")
      .data(tickData, (d) => d)
      .join("line")
      .attr("class", "tick")
      .attr("x1", (year) => yearScale(year))
      .attr("x2", (year) => yearScale(year))
      .attr("y1", sliderY - 5)
      .attr("y2", sliderY + 5)
      .attr("stroke", "#999")
      .attr("stroke-width", 1);

    // Draw year labels
    sliderGroup
      .selectAll("text.year-label")
      .data(tickData, (d) => d)
      .join("text")
      .attr("class", "year-label")
      .attr("x", (year) => yearScale(year))
      .attr("y", sliderY + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text((year) => year);

    // Create or update draggable handle
    const handle = sliderGroup
      .selectAll("circle.handle")
      .data([currentYear])
      .join("circle")
      .attr("class", "handle")
      .attr("cx", yearScale(currentYear))
      .attr("cy", sliderY)
      .attr("r", 10)
      .attr("fill", "#69b3a2")
      .attr("cursor", "pointer")
      .on("mouseover", (e) => {
        d3.select(this).raise();
      });

    // Drag behavior

    const handleClickorDrag = (event) => {
      if (!ref.current) return;

      // Use d3.pointer to get coordinates relative to the SVG element
      const [svgX] = d3.pointer(event, ref.current);

      const x = Math.max(
        sliderPadding,
        Math.min(svgX, sliderPadding + sliderWidth),
      );

      currentYear = Math.round(yearScale.invert(x));

      handle.attr("cx", yearScale(currentYear));
      svg
        .selectAll("g.node")
        .selectAll("circle")
        .attr("r", (d) => {
          return d.type === "marketsize"
            ? (d.data["2025"] *
                (d.data["growth_rate"] ** (currentYear - yearStart)) )/
                (2 * Math.PI * 2)
            : base_r;
        });
    };

    const drag = d3.drag().on("drag", function (event) {
      handleClickorDrag(event);
    });

    handle.call(drag);

    return () => {
      simulation.stop();
    };
  });

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default TechnologiesSVG;

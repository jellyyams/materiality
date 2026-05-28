import * as d3 from "d3";
import { useEffect, useRef } from "react";

const EnergyChartSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth * 0.45;
  const height = props.height;
  const marginTop = 10;
  const marginBottom = 50;
  const marginLeft = 20;
  const marginRight = 20;
  const sliderPadding = 30;

  const filename = "/data/energy.csv";

  useEffect(() => {
    if (!ref.current || !width) return;
    let currentYear = 2023;
    // Draw ticks for each year
    const validYears = [2023, 2024, 2030, 2035];
    const svg = d3.select(ref.current);

    d3.csv(filename).then(function (data) {
      let filteredData = data.filter((d) => d.Type !== "Total");
      // Group filtered data by Type and Year
      let grouped = d3.group(
        filteredData,
        (d) => d.Type,
        (d) => d.Year,
      );
      console.log("grouped", grouped);

      // Create nodes_data with values stored by year and type
      let nodes_data = Array.from(grouped, ([type, yearMap]) => {
        const valuesByYear = {};
        yearMap.forEach((yearData, year) => {
          valuesByYear[year] = d3.sum(yearData, (d) => +d.TWh);
        });
        return {
          id: type,
          name: type,
          valuesByYear: valuesByYear,
          value: valuesByYear[currentYear] || 0, // Set initial value for current year
        };
      });

      console.log(nodes_data)

      const links = [];
      for (let i = 0; i < nodes_data.length; i++) {
        for (let j = i + 1; j < nodes_data.length; j++) {
          links.push({
            source: nodes_data[i],
            target: nodes_data[j],
          });
        }
      }

      let node = svg
        .selectAll("g.node")
        .data(nodes_data, (d) => d.id)
        .join("g")
        .attr("class", "node");

      node
        .selectAll("circle")
        .data(nodes_data)
        .join("circle")
        .attr("r", (d) => {
          return d.value / (Math.PI * 1.8);
        })
        .attr("fill", "var(--accent-dark)")
        .style("opacity", 1);


      // Create force simulation
      const simulation = d3
        .forceSimulation(nodes_data)
        .force(
          "center",
          d3
            .forceCenter(
              (width - marginLeft - marginRight) / 2 + marginLeft,
              (height - marginBottom - marginTop) / 2 + marginTop,
            )
            .strength(0.8),
        )
        .force("link", d3.forceLink(links).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collide", d3.forceCollide((d) => d.r + 5).strength(1));

      // Update positions on each simulation tick
      simulation.on("tick", () => {
        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

      const drawBubbles = () => {
        // Convert Map to array of objects using TWh values

        node
          .selectAll("circle")
          .data((d) => [d])
          .join("circle")
          .attr("r", (d) => {
            console.log(d);
            return d.value / (Math.PI * 1.8);
          });

        node
        .selectAll("text.name")
        .data((d) => [d])
        .join("text")
        .attr("class", "name")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "var(--main-light)")
        .text((d) => `${d.name}`);

      node
        .selectAll("text.val")
        .data((d) => [d])
        .join("text")
        .attr("class", "val")
        .attr("text-anchor", "middle")
        .attr("dy", "1.2rem")
        .attr("font-size", "12px")
        .attr("fill", "var(--main-light)")
        .text((d) => `${d.value} TWh`);

        // Update collide force with new radii
        simulation.force(
          "collide",
          d3.forceCollide((d) => d.value / (Math.PI * 1.8) + 5).strength(0.3),
        );

        // Use a gentle reheat instead of full restart
        simulation.alpha(0.1).restart();
      };

      // Draw initial bubbles
      drawBubbles();

      const sliderWidth = width - 2 * sliderPadding;
      const sliderY = height - marginBottom;

      const yearScale = d3
        .scaleLinear()
        .domain([currentYear, 2035])
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
        .attr("stroke", "var(--main-light)")
        .attr("stroke-width", (d) => (d.type === "visible" ? 3 : 6))
        .attr("cursor", "pointer")
        .on("click", function (event) {
          handleClickorDrag(event);
        })
        .on("mouseover", (e) => {
          d3.select(this).raise();
        });

      sliderGroup
        .selectAll("line.tick")
        .data(validYears, (d) => d)
        .join("line")
        .attr("class", "tick")
        .attr("x1", (year) => yearScale(year))
        .attr("x2", (year) => yearScale(year))
        .attr("y1", sliderY - 5)
        .attr("y2", sliderY + 5)
        .attr("stroke", "var(--main-light)")
        .attr("stroke-width", 1);

      // Draw year labels
      sliderGroup
        .selectAll("text.year-label")
        .data(validYears, (d) => d)
        .join("text")
        .attr("class", "year-label")
        .style("font-size", 12)
        .attr("fill", "var(--main-light)")
        .attr("text-anchor", "end")
        .attr("transform", (d) => {
          return `translate(${yearScale(d)}, ${sliderY + 8}) rotate(-45)`;
        })
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
        .attr("fill", "var(--accent-light)")
        .attr("cursor", "pointer")
        .on("mouseover", (e) => {
          d3.select(this).raise();
        });

      const handleClickorDrag = (event) => {
        if (!ref.current) return;

        // Use d3.pointer to get coordinates relative to the SVG element
        const [svgX] = d3.pointer(event, ref.current);

        const x = Math.max(
          sliderPadding,
          Math.min(svgX, sliderPadding + sliderWidth),
        );

        const invertedYear = yearScale.invert(x);

        // Find the closest year in validYears
        currentYear = validYears.reduce((closest, year) => {
          return Math.abs(year - invertedYear) <
            Math.abs(closest - invertedYear)
            ? year
            : closest;
        });

        handle.attr("cx", yearScale(currentYear));

        // Update node values based on selected year
        nodes_data.forEach((node) => {
          node.value = node.valuesByYear[currentYear] || 0;
        });

        // Redraw bubbles with new year data
        drawBubbles();
      };

      const drag = d3.drag().on("drag", function (event) {
        handleClickorDrag(event);
      });

      handle.call(drag);
    });
  }, [width]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default EnergyChartSVG;

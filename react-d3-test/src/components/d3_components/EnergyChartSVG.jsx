import * as d3 from "d3";
import { useEffect, useRef } from "react";

const EnergyChartSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth;
  const height = props.height;
  const marginTop = 30;
  const marginBottom = 40;
  const marginLeft = 80;
  const marginRight = 30;

  const filename = "/data/energy.csv";

  useEffect(() => {
    if (!ref.current || !width) return;
    let currentYear = 2023;
    // Draw ticks for each year
    const validYears = [2023, 2024, 2030, 2035];
    const svg = d3.select(ref.current);

    d3.csv(filename).then(function (data) {
      let filteredData = data
        .filter((d) => +d.Year === currentYear)
        .filter((d) => d.Type !== "Total");
      // Group filtered data by Type and sum TWh values
      let grouped = d3.group(filteredData, (d) => d.Type);
      console.log("grouped", grouped);

      let nodes_filtered = [];
      let node = svg.selectAll("g.node");
      console.log(data);

      // Create force simulation
      const simulation = d3
        .forceSimulation(nodes_filtered)
        .force(
          "center",
          d3
            .forceCenter(
              (width - marginLeft - marginRight) / 2 + marginLeft,
              (height - marginBottom - marginTop) / 2 + marginTop,
            )
            .strength(0.8),
        )
        .force("charge", d3.forceManyBody().strength(-30))
        .force("collide", d3.forceCollide((d) => d.r + 5).strength(1));

      // Update positions on each simulation tick
      simulation.on("tick", () => {
        node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

      const drawBubbles = () => {
        // Convert Map to array of objects using TWh values
        nodes_filtered = Array.from(grouped, ([type, values]) => ({
          id: type,
          name: type,
          value: d3.sum(values, (d) => +d.TWh), // Sum the TWh values for this type
        }));
        console.log(nodes_filtered)

        // Create group for each node
        let updated_nodes = svg
          .selectAll("g.node")
          .data(nodes_filtered, (d) => d.id)
          .join(
            function (enter) {
              node = enter.append("g").attr("class", "node");
              node
                .append("circle")
                .attr("r", (d) => {
                    console.log("entering")
                    console.log(d)
                  return d.value / (Math.PI * 1.8);
                })
                .attr("fill", "steelblue")
                .attr("opacity", 0.7);
              node
                .append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "0.3em")
                .attr("font-size", "12px")
                .text((d) => d.name);
            }, 
            function(update) {
                update.selectAll("circle").attr("r", d => {return d.value / (Math.PI * 1.8);})
                node = node.merge(update)
            }
          );

        // Update circles with new sizes
        node
          .selectAll("circle")
          .data((d) => [d])
          .join("circle")
          .attr("r", (d) => {
            console.log(d);
            return d.value / (Math.PI * 1.8);
          })
          .attr("fill", "steelblue")
          .attr("opacity", 0.7);

        // Update collide force with new radii
        simulation
          .force("collide", d3.forceCollide((d) => d.value / (Math.PI * 1.8) + 5).strength(0.3));

        // Update simulation with new nodes without restarting
        simulation.nodes(nodes_filtered);
        // Use a gentle reheat instead of full restart
        simulation.alpha(0.1).restart();
      };

      // Draw initial bubbles
      drawBubbles();

      const sliderPadding = 20;
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

      sliderGroup
        .selectAll("line.tick")
        .data(validYears, (d) => d)
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
        .data(validYears, (d) => d)
        .join("text")
        .attr("class", "year-label")
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
        .attr("fill", "#69b3a2")
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

        filteredData = data
          .filter((d) => +d.Year === currentYear)
          .filter((d) => d.Type !== "Total");
        // Group filtered data by Type and sum TWh values
        grouped = d3.group(filteredData, (d) => d.Type);

        // Redraw bubbles with new year data
        drawBubbles();
        // svg
        // .selectAll("g.node")
        // .selectAll("circle")
        // .attr("r", (d) => {
        //   return (d.data["2025"] / (2 * Math.PI * 2)) *
        //         d.data["growth_rate"] ** (currentYear - yearStart)
       
        // });
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

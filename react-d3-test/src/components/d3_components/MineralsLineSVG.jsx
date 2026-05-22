import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsLineSVG = (props) => {
  const ref = useRef();
  const filename = "/minerals.csv";

  const width = props.parentWidth;
  const height = 500;
  const marginTop = 30;
  const marginBottom = 30;
  const marginLeft = 50;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    d3.csv(filename).then(function (data) {
      const xExtent = d3.extent(data, (d) => {
        return +d.Year;
      });
      const xScale = d3.scaleLinear(xExtent, [marginLeft, width - marginRight]);
      const yScale = d3.scaleLinear(
        [0, d3.max(data, (d) => +d.Demand)],
        [height - marginBottom, marginTop],
      );

      console.log(d3.max(data, (d) => d.Demand));

      const mineral_groups = d3.group(data, (d) => d.Mineral);
      console.log(mineral_groups);

      const line = d3
        .line()
        .x((d) => xScale(+d.Year))
        .y((d) => yScale(+d.Demand));

      // Get unique minerals and sort for consistent color mapping
      const mineralNames = Array.from(mineral_groups.keys()).sort();

      // Create a color scale for different minerals with explicit domain
      const colorScale = d3
        .scaleOrdinal()
        .domain(mineralNames)
        .range(d3.schemeCategory10);

      // Add or update x-axis
      svg
        .selectAll("g.x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(xScale).ticks(5));

      // Add or update y-axis
      svg
        .selectAll("g.y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(yScale));

      // Convert Map to array of entries and create lines for each mineral
      svg
        .selectAll("path.mineral-line")
        .data(mineralNames, (d) => d)
        .join("path")
        .attr("class", "mineral-line")
        .attr("stroke", (d) => colorScale(d))
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("d", (mineral) => {
          return line(mineral_groups.get(mineral));
        });

      // Create legend
      const legendGroup = svg
        .selectAll("g.legend")
        .data([null])
        .join("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - 150}, ${marginTop})`);

      // Add legend items
      legendGroup
        .selectAll("g.legend-item")
        .data(mineralNames, (d) => d)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`)
        .each(function (mineral) {
          const item = d3.select(this);

          // Add color square
          item
            .selectAll("rect")
            .data([mineral])
            .join("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (mineral) => colorScale(mineral));

          // Add label
          item
            .selectAll("text")
            .data([mineral])
            .join("text")
            .attr("x", 18)
            .attr("y", 10)
            .attr("font-size", "12px")
            .text((m) => m);
        });
      return () => {
       d3.selectAll("svg > *").remove();
      };
    });
  }, [
    width,
    filename,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  ]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsLineSVG;

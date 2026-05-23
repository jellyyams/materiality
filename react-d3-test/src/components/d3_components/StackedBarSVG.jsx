import * as d3 from "d3";
import { useEffect, useRef } from "react";
import dataCenterNodes from "../../data/datacenters.json";

const StackedBarSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth;
  const height = props.height;
  const marginTop = 30;
  const marginBottom = 30;
  const marginLeft = 30;
  const marginRight = 30;
  const filename = "/data/datacenters.csv";

  useEffect(() => {
    if (!ref.current || !width) return;
    const svg = d3.select(ref.current);

    d3.csv(filename).then(function (data) {
      const series = d3
        .stack()
        .keys(d3.union(data.map((d) => d.Region)))
        .value(([, D], key) => D.get(key).GW)(
        d3.index(
          data,
          (d) => d.Year,
          (d) => d.Region,
        ),
      );

      console.log(series)

      const xExtent = d3.extent(data, (d) => {
        return +d.Year;
      });
      const xScale = d3.scaleLinear(xExtent, [marginLeft, width - marginRight]);
      const yScale = d3.scaleLinear(
        [0, 200],
        [height - marginBottom, marginTop],
      );

      const area = d3
        .area()
        .x((d) => xScale(d.data[0]))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]));

      // Get unique minerals and sort for consistent color mapping
      //   const names = Array.from(grouped_data.keys()).sort();

      // Create a color scale for different minerals with explicit domain
      const colorScale = d3
        .scaleOrdinal()
        .domain(series.map((d) => d.key))
        .range(d3.schemeCategory10);

      // Convert Map to array of entries and create lines for each mineral
      //   svg
      //     .selectAll("path.mineral-line")
      //     .data(names, (d) => d)
      //     .join("path")
      //     .attr("class", "mineral-line")
      //     .attr("stroke", (d) => colorScale(d))
      //     .attr("stroke-width", 2)
      //     .attr("fill", "none")
      //     .attr("d", (region) => {
      //       return line(grouped_data.get(region));
      //     });

      svg
        .append("g")
        .selectAll()
        .data(series)
        .join("path")
        .attr("fill", (d) => colorScale(d.key))
        .attr("d", area)
        .append("title")
        .text((d) => d.key);

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
    });
  });
  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};
export default StackedBarSVG;

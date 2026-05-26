import * as d3 from "d3";
import { useEffect, useRef } from "react";
import dataCenterNodes from "../../data/datacenters.json";

const StackedLineSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth * 0.3;
  const height = props.height;
  const marginTop = 30;
  const marginBottom = 60;
  const marginLeftChart = 60;
  const marginLeft = 5
  const marginRight = 30;
  const filename = "/data/datacenters.csv";

  const fullNames = { "America" : "America", "EMEA": "Europe, Middle East, Africa", "APAC": "Asia-Pacific"}

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

      const xExtent = d3.extent(data, (d) => {
        return +d.Year;
      });
      const xScale = d3.scaleLinear(xExtent, [marginLeftChart, width - marginRight]);
      const yScale = d3.scaleLinear(
        [0, 200],
        [height - marginBottom, marginTop],
      );

      const area = d3
        .area()
        .x((d) => xScale(d.data[0]))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]));

      // Create a color scale for different minerals with explicit domain

      const labels = series.map((d) => d.key);

      const colorScale = d3
        .scaleOrdinal()
        .domain(labels)
        .range([
          "var(--accent-dark1)",
          "var(--accent-dark)",
          "var(--accent-dark2)",
          "var(--accent-dark2)",
          "var(--main-light)",
          "var(--main-light)",
        ]);

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
        .style("color", "var(--main-light)")
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")));

      svg
        .selectAll("text.xlabel")
        .data([null])
        .join("text")
        .attr("class", "xlabel")
        .attr("fill", "var(--main-light)")
        .attr("font-family", "var(--heading-font)")
        .attr("font-size", "12px")
        .attr("transform", `translate(${5}, ${height - 10})`)
        .text("Projected Global Data Center Capacity");

      svg
        .selectAll("text.ylabel")
        .data([null])
        .join("text")
        .attr("class", "ylabel")
        .attr("fill", "var(--main-light)")
        .attr("font-size", "12px")
        .attr(
          "transform",
          `translate(${5}, ${(height - marginBottom - 40) / 2}) rotate(90)`,
        )
        .text("Gigawatt (GW)");

      // Add or update y-axis
      svg
        .selectAll("g.y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${marginLeftChart}, 0)`)
        .style("color", "var(--main-light)")
        .call(d3.axisLeft(yScale));

      // Create legend
      const legendGroup = svg
        .selectAll("g.legend")
        .data([null])
        .join("g")
        .attr("class", "legend")
        .attr("transform", `translate(${marginLeftChart + 20}, ${marginTop})`);

      // Add legend items
      legendGroup
        .selectAll("g.legend-item")
        .data(labels, (d) => d)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", function(d, i){
    
            return `translate(0, ${40 - (i * 20)})`

        })
        .each(function (label) {
          const item = d3.select(this);

          // Add color square
          item
            .selectAll("rect")
            .data([label])
            .join("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", (label) => colorScale(label));

          // Add label
          item
            .selectAll("text")
            .data([label])
            .join("text")
            .attr("x", 18)
            .attr("y", 10)
            .attr("font-size", "10px")
            .attr("fill", "var(--main-light)")
            .text((m) => fullNames[m]);
        });
    });
  });
  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};
export default StackedLineSVG;

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import dataCenterNodes from "../../data/datacenters.json";

const StackedLineSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth * 0.45;
  const height = props.height;
  const marginTop = 20;
  const marginBottom = 60;
  const marginLeftChart = 50;
  const marginLeft = 5;
  const marginRight = 30;
  const filename = "/data/datacenters.csv";

  const fullNames = {
    America: "Americas",
    EMEA: "Europe, Middle East, Africa",
    APAC: "Asia-Pacific",
  };

  useEffect(() => {
    if (!ref.current || !width) return;
    const svg = d3.select(ref.current);

    d3.csv(filename).then(function (data) {
      const hoverGroup = svg
        .selectAll("g.hover")
        .data([""])
        .join("g")
        .attr("class", "hover")
        .style("visibility", "hidden");
        
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
      const xScale = d3.scaleLinear(xExtent, [
        marginLeftChart,
        width - marginRight,
      ]);
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
          "var(--main-light)",
          "var(--accent-dark2)",
          "var(--main-light)",
          "var(--main-light)",
        ]);

      svg
        .append("g")
        .attr("class", "area")
        .selectAll()
        .data(series)
        .join("path")
        .attr("class", "hiii")
        .attr("fill", (d) => colorScale(d.key))
        .attr("d", area)
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
        .attr("transform", `translate(${10}, ${marginTop})`);

      const lengths = [0, 75, 235];
      // Add legend items
      legendGroup
        .selectAll("g.legend-item")
        .data(labels, (d) => d)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", function (d, i) {
          return `translate(${lengths[i]}, ${height - 40})`;
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


      const hoverLine = hoverGroup
        .selectAll("line")
        .data(["hi"])
        .join("line")
        .attr("y1", `${height - marginBottom}`)
        .attr("y2", `${marginTop}`)
        .attr("x2", `${marginLeftChart}`)
        .attr("x1", `${marginLeftChart}`)
        .attr("stroke", "var(--main-dark)")
        .style("stroke-width", "2px")
        ;

      const hoverC = hoverGroup
        .selectAll("circle")
        .data(["d"])
        .join("circle")
        .attr("fill", "var(--accent-light)")
        .attr("r", 3);

      const hoverText = hoverGroup.selectAll("text").data(["d"]).join("text").attr("fill", "var(--accent-light)").attr("text-anchor", "middle").attr("font-size", "12px");

      function hoverMouseOff() {
        hoverGroup.style("visibility", "hidden");
      }

      function hoverMouseOn(e) {
        const mouseX = d3.pointer(e)[0];
        const graphX = xScale.invert(mouseX);
        const yearHover = Math.min(Math.max(Math.round(graphX), 2025), 2030);
        d3.select("g.hover").raise(); 
        hoverGroup.style("visibility", "visible")
        updateHoverLine(yearHover);
      }


      function updateHoverLine(year) {
        const graphX_snap = xScale(year);
        // Find the cumulative sum (top of the stack) for this year
        // series is an array of stacks, each stack is an array of [y0, y1] for each year
        // Find the index for the year
        const yearIdx = data.findIndex(d => +d.Year === year);
        let topValue = 0;
        if (yearIdx !== -1 && series.length > 0) {
          // The top of the stack is the last series' y1 for this year
          const lastSeries = series[series.length - 1];
          if (lastSeries[yearIdx]) {
            topValue = lastSeries[yearIdx][1];
          }
        }

        hoverLine.attr("x1", graphX_snap).attr("x2", graphX_snap);
        hoverC.attr(
          "transform",
          `translate(${graphX_snap}, ${yScale(topValue)})`,
        );

        hoverText
          .attr(
            "transform",
            `translate(${graphX_snap}, ${yScale(topValue) - 10})`,
          )
          .text(`Total: ${topValue.toFixed(2)} GW`);
      }

      svg.selectAll("g.area").on("mousemove", function (event, d) {
        hoverMouseOn(event);
      }).on("mouseleave", function(event, d){
        hoverMouseOff();
      });
    });
  });
  return <svg id="stacked_graph" width={width} height={height} ref={ref}></svg>;
};
export default StackedLineSVG;

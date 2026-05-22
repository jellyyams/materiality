import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsBarSVG = (props) => {
  const ref = useRef();
  const filename = "/minerals.csv";
  const maxYear = 2040;

  const width = props.parentWidth / 2;
  const height = 500;
  const marginTop = 30;
  const marginBottom = 30;
  const marginLeft = 50;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    svg.selectAll("*").remove();

    d3.csv(filename).then(function (data) {
      const filtered = d3.filter(data, (d) => {
        return d.Mineral === props.currMineral && d.Year <= maxYear;
      });

      const xScale = d3
        .scaleBand()
        .domain(filtered.map((d) => +d.Year))
        .range([marginLeft, width - marginRight])
        .padding(0.2);

      console.log(filtered);

      const yScale = d3.scaleLinear(
        [0, d3.max(filtered, (d) => +d.Demand)],
        [height - marginBottom, marginTop],
      );

      svg
        .selectAll("mybars")
        .data(filtered)
        .join("rect")
        .attr("x", (d) => {
          console.log(xScale(+d.Year));
          return xScale(+d.Year);
        })
        .attr("y", (d) => {
          return yScale(+d.Demand);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => {
          return height - yScale(+d.Demand) - marginBottom;
        })
        .attr("fill", "none")
       .attr("stroke", "red")
       .attr("stroke-width", 2);

      svg
        .selectAll("lines")
        .data(filtered)
        .join("line")
        .attr("x1", (d) => {
          return xScale(+d.Year);
        })
        .attr("x2", (d) => {
          return xScale(+d.Year) + xScale.bandwidth();
        })
        .attr("y1", (d) => {
          console.log(d)
          return yScale(+d.Supply_mining);
        })
        .attr("y2", (d) => {
          return yScale(+d.Supply_mining);
        })
        .attr("stroke-width", 2)
        .attr("stroke", "black");

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
  }, [width, props.currMineral]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsBarSVG;

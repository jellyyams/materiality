import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsBarSVG = (props) => {
  const ref = useRef();
  const filename = "/data/minerals.csv";
  const maxYear = 2040;

  const width = props.parentWidth / 3;
  const height = 700;
  const marginTop = 30;
  const marginBottomBar = 400;
  const marginLeft = 50;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    let circlesPerRow = 6;
    const circle_r = 4;
    const circle_padding = 12;
    let factor = 1;

    const svg = d3.select(ref.current);

    svg.selectAll("*").remove();

    // Track if this effect is still the current one
    let isMounted = true;

    d3.csv(filename).then(function (data) {
      // Only render if this effect is still active
      if (!isMounted) return;

      const filtered = d3.filter(data, (d) => {
        return d.Mineral === props.currMineral && d.Year <= maxYear;
      });

      const xScale = d3
        .scaleBand()
        .domain(filtered.map((d) => +d.Year))
        .range([marginLeft, width - marginRight])
        .padding(0.2);

      circlesPerRow = Math.floor(
        xScale.bandwidth() / (circle_r + circle_padding - 5),
      );

      console.log(filtered);

      const yScale = d3.scaleLinear(
        [0, d3.max(filtered, (d) => +d.Demand)],
        [height - marginBottomBar, marginTop],
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
          return height - yScale(+d.Demand) - marginBottomBar;
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
          console.log(d);
          return yScale(+d.Supply_mining);
        })
        .attr("y2", (d) => {
          return yScale(+d.Supply_mining);
        })
        .attr("stroke-width", 2)
        .attr("stroke", "black");

      if (d3.max(filtered, (d) => +d.Gap_mining) > 100) {
        if (d3.max(filtered, (d) => +d.Gap_mining) > 1000) {
          factor = 200;
        } else {
          factor = 10;
        }
      }

      svg
        .selectAll("g.circles")
        .data(filtered, (d) => d.Year)
        .join("g")
        .attr("class", "circles")
        .attr("id", (d) => d.Year)
        .attr("transform", (d) => {
          return `translate(${xScale(+d.Year)}, ${height - marginBottomBar + 40})`;
        })
        .each(function (d) {
          const circleData = [];
          let positive = true;
          let absolute = Math.abs(+d.Gap_mining);
          if (+d.Gap_mining < 0) {
            positive = false;
          }

          for (let i = 0; i < absolute / factor; i++) {
            circleData.push({
              index: i,
              positive: positive,
            });
          }

          d3.select(this)
            .selectAll("circle")
            .data(circleData, (d, i) => i)
            .join("circle")
            .attr("r", circle_r)
            .attr("cx", (cd) => {
              return (cd.index % circlesPerRow) * circle_padding;
            })
            .attr("cy", (cd) => {
              return Math.floor(cd.index / circlesPerRow) * circle_padding;
            })
            .attr("fill", (d) => {
              return d.positive ? "red" : "black";
            });
        });

      // Add or update x-axis
      svg
        .selectAll("g.x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - marginBottomBar})`)
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

    // Cleanup function: mark this effect as no longer active
    return () => {
      isMounted = false;
    };
  }, [width, props.currMineral]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsBarSVG;

import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsBarSVG = (props) => {
  const ref = useRef();
  const filename = "/data/minerals.csv";
  const maxYear = 2040;

  const width = props.parentWidth * 0.5;
  const height = 350;
  const marginTop = 80;
  const marginBottomBar = 100;
  const marginLeft = 50;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    let circlesPerRow;
    let factor = 1;

    const circle_r = 3;
    const circle_padding = 10;

    const svg = d3.select(ref.current);

    svg.selectAll("*").remove();

    svg
      .selectAll("text.heading")
      .data([""])
      .join("text")
      .attr("class", "heading")
      .attr("text-anchor", "start")
      .attr("transform", `translate(${5}, ${20})`)
      .attr("fill", "var(--main-light)")
      .attr("font-family", "var(--heading-font)")
      .attr("font-size", "12px")
      .text(
        `Projected Supply and Demand for ${props.currMineral} in Kilo Tons (kt)`,
      );

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
        (xScale.bandwidth()) / (circle_r + circle_padding - 4),
      );

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
          return yScale(+d.Supply_mining);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => {
          return height - yScale(+d.Supply_mining) - marginBottomBar;
        })
        .attr("fill", "var(--accent-light)");

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
          return yScale(+d.Demand);
        })
        .attr("y2", (d) => {
          return yScale(+d.Demand);
        })
        .attr("stroke-width", 3)
        .attr("class", "dashedline")
        .attr("stroke", "var(--accent-dark1)");

      if (d3.max(filtered, (d) => +d.Gap_mining) > 100) {
        if (d3.max(filtered, (d) => +d.Gap_mining) > 500) {
          if (d3.max(filtered, (d) => +d.Gap_mining) > 1000) {
            factor = 600;
          } else {
            factor = 15;
          }
        } else {
          factor = 3;
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

          for (let i = 0; i < Math.floor(absolute / factor); i++) {
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
              return ((cd.index % circlesPerRow) * circle_padding + 3);
            })
            .attr("cy", (cd) => {
              return Math.floor(cd.index / circlesPerRow) * circle_padding + 15;
            })
            .attr("fill", (d) => {
              return d.positive ? "var(--accent-light)" : "var(--main-light)";
            });

          d3.select(this)
            .selectAll("text")
            .data([d])
            .join("text")
            .attr("fill", function (d) {
              if (+d.Gap_mining > 0) {
                return "var(--accent-light)";
              } else {
                return "var(--main-light)";
              }
            })
            .attr("font-size", 11)
            .text(function (d) {
              if (+d.Gap_mining > 0) {
                return `${+d.Gap_mining} Deficit`;
              } else {
                return `${-1 * +d.Gap_mining} Surplus`;
              }
            });
        });

      // Add or update x-axis
      svg
        .selectAll("g.x-axis")
        .data([null])
        .join("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - marginBottomBar})`)
        .attr("color", "var(--main-light)")
        .call(d3.axisBottom(xScale).ticks(5));

      // Add or update y-axis
      svg
        .selectAll("g.y-axis")
        .data([null])
        .join("g")
        .attr("class", "y-axis")
        .attr("color", "var(--main-light)")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(yScale));

      // Create legend
      const legendGroup = svg
        .selectAll("g.legend")
        .data([null])
        .join("g")
        .attr("class", "legend")
        .attr("transform", `translate(${marginLeft}, ${50})`);

      legendGroup
        .selectAll("rect")
        .data(["Supply"])
        .join("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("x", -20)
        .attr("y", -10)
        .attr("fill", "var(--accent-light)");

      legendGroup
        .selectAll("line")
        .data(["Demand"])
        .join("line")
        .attr("x1", 55)
        .attr("x2", 85)
        .attr("y1", -5)
        .attr("y2", -5)
        .attr("stroke-width", 3)
        .attr("class", "dashedline")
        .attr("stroke", "var(--accent-dark1)");

      legendGroup
        .selectAll("circle.legend")
        .data(["kt"])
        .join("circle")
        .attr("class", "legend")
        .attr("cx", 157)
        .attr("cy", -5)
        .attr("fill", "var(--accent-light)")
        .attr("r", circle_r);

      // Add legend items
      legendGroup
        .selectAll("g.legend-item")
        .data(["Supply", "Demand", `${factor} kt`], (d) => d)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", function(d, i){
          if(d === "Demand"){
            return `translate(${90},0)`

          } else if(d ==="Supply") {
            return `translate(0,0)`

          } 
          return `translate(${165},0)`

        })
        .each(function (mineral) {
          d3.select(this)
            .selectAll("text")
            .data([mineral])
            .join("text")
            .attr("font-size", "12px")
            .attr("fill", "var(--main-light)")
            .text((m) => m);
        });
    });

    // Cleanup function: mark this effect as no longer active
    return () => {
      isMounted = false;
    };
  }, [width, props.currMineral]);

  return <svg id="minerals_bar" width={width} height={height} ref={ref}></svg>;
};

export default MineralsBarSVG;

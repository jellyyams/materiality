import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsTreeSVG = (props) => {
  const ref = useRef();
  const filename = "/data/minerals_GW.csv";

  const width = props.parentWidth * 0.45;
  const height = 350;
  const marginTop = 30;
  const marginBottom = 30;
  const marginLeft = 50;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    d3.csv(filename).then(function (data) {
      // Convert Amount to number
      data.forEach((d) => {
        d.Amount = +d.Amount;
      });

      // Build hierarchy: root -> Usages -> Minerals
      const usages = Array.from(new Set(data.map((d) => d.Usage)));
      const minerals = Array.from(new Set(data.map((d) => d.Mineral)));
      console.log(minerals)
      const root = {
        name: "root",
        children: usages.map((usage) => ({
          name: usage,
          children: data
            .filter((d) => d.Usage === usage)
            .map((d) => ({
              name: d.Mineral,
              value_draw: d.Amount < 100 ? 100 : d.Amount,
              value_actual: d.Amount,
              symbol: d.Symbol,
            })),
        })),
      };

      // Treemap layout
      const treemapLayout = d3
        .treemap()
        .size([width, height])
        .paddingInner(2)
        .padding(4)
        .paddingTop(16);

      const hierarchy = d3
        .hierarchy(root)
        .sum((d) => d.value_draw)
        .sort((a, b) => b.value_draw - a.value_draw);

      treemapLayout(hierarchy);

      // Color scale for usages
      const color = d3
        .scaleOrdinal()
        .domain(minerals)
        .range(d3.schemeCategory10);

      // Draw groups for each usage
      const usageGroups = svg
        .selectAll("g.usage")
        .data(hierarchy.children)
        .join("g")
        .attr("class", "usage")
        .attr("transform", function(d){
          return `translate(0, 0)`
        } )
        ;

      // Draw minerals (leaves)
      usageGroups
        .selectAll("g.mineral")
        .data((d) => d.children)
        .join("g")
        .attr("class", "mineral")
        .attr("transform", (d) => `translate(${d.x0} ,${d.y0})`)
        .each(function (d) {
          const g = d3.select(this);
          g.append("rect")
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("class", (d) => d.data.name)
            .attr("fill", function (d) {
              console.log(d.data.name);
              return color(d.data.name);
            })
            .on("mouseover", function(e, d){
              console.log(d.data.name)
            })
            ;

          // if (d.data.value_actual > 1000) {
          //   g.append("text")
          //     .attr("x", 4)
          //     .attr("y", 16)
          //     .attr("fill", "#fff")
          //     .attr("font-size", "12px")
          //     .text(d.data.name);
          // }
        });

      // Draw usage labels
      usageGroups
        .append("text")
        .attr("x", (d) => d.x0 + 5)
        .attr("y", (d) => d.y0 + 9)
        .attr("font-size", "12px")
        .attr("font-family", "var(--heading-font)")
        .attr("fill", "var(--main-light)")
        .text((d) => d.data.name);
    });
  }, [width, filename, height]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsTreeSVG;

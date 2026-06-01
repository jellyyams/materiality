import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsTreeSVG = (props) => {
  const ref = useRef();
  const filename = "/data/minerals_GW.csv";

  const width = props.parentWidth * 0.65;
  const height = 330;
  const marginTop = 5;
  const marginBottom = 30;
  const marginLeft = 10;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    function setTooltip(hovered_data, event) {
      const svgRect = ref.current.getBoundingClientRect();
      const [mouseX, mouseY] = d3.pointer(event, ref.current);
      const tt = d3.select("#tooltip");
      tt.style("display", null);
      tt.attr("transform", `translate(${mouseX + 10},${mouseY - 20})`);
      d3.select("#tooltip_h").text(hovered_data.name);
      d3.select("#tooltip_v").text(`${hovered_data.value_actual} kg`);
    }

    function moveTooltip(event) {
      const [mouseX, mouseY] = d3.pointer(event, ref.current);
      d3.select("#tooltip").attr(
        "transform",
        `translate(${mouseX + 10},${mouseY - 20})`,
      );
    }

    function hideTooltip() {
      d3.select("#tooltip").style("display", "none");
    }

    d3.csv(filename).then(function (data) {
      // Convert Amount to number
      data.forEach((d) => {
        d.Amount = +d.Amount;
      });

      // Build hierarchy: root -> Usages -> Minerals
      const usages = Array.from(new Set(data.map((d) => d.Usage)));
      const minerals = Array.from(new Set(data.map((d) => d.Mineral)));

      const root = {
        name: "root",
        children: usages.map((usage) => ({
          name: usage,
          children: data
            .filter((d) => d.Usage === usage)
            .map((d) => ({
              name: d.Mineral,
              value_draw: d.Amount < 80 ? 80 : d.Amount,
              value_actual: d.Amount,
              symbol: d.Symbol,
            })),
        })),
      };

      // Treemap layout
      const treemapLayout = d3
        .treemap()
        .size([width - marginRight, height - marginBottom - marginTop])
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
        .range([
          "#f3908f",
          "#d79355",
          "#F5F5F5",
          "#3634C6",
          "#00a384",
          "#0aea6b",
          "#0085ff",
          "#5d5af7",
          "#9d1a7d",
          "#533921",
          "#ce3333",
          "#ddff00",
          "#61ffe2",
          "#4b1f74",
          "#9ccfff",
        ]);

      // Draw groups for each usage
      const usageGroups = svg
        .selectAll("g.usage")
        .data(hierarchy.children)
        .join("g")
        .attr("class", "usage")
        .attr("transform", function (d) {
          return `translate(${0}, ${marginTop - 5})`;
        });
      // Draw minerals (leaves)
      usageGroups
        .selectAll("g.mineral")
        .data((d) => d.children)
        .join("g")
        .attr("class", "mineral")
        .attr("transform", (d) => `translate(${d.x0} ,${d.y0})`)
        .each(function (d) {
          const g = d3.select(this);
          const rect_w = d.x1 - d.x0;
          const rect_h = d.y1 - d.y0;
          g.append("rect")
            .attr("width", `${rect_w}`)
            .attr("height", `${rect_h}`)
            .attr("class", (d) => d.data.name)
            .style("opacity", "1")
            .attr("id", (d) => d.data.symbol)
            .attr("fill", function (d) {
              return color(d.data.name);
            })
            .on("mouseover", function (event, d) {
              setTooltip(d.data, event);
              d3.selectAll(`#${d.data.symbol}`)
                .style("stroke-width", "2")
                .style("stroke", "var(--accent-light)");
            })
            .on("mousemove", function (event, d) {
              moveTooltip(event);
            })
            .on("mouseout", function (event, d) {
              hideTooltip();
              d3.selectAll(`#${d.data.symbol}`).style("stroke-width", "0");
            });

          if (rect_w > 30 && rect_h > 20) {
            g.append("text")
              .text((d) => d.data.symbol)
              .attr("transform", "translate(5, 19)")
              .attr("fill", "var(--main-dark)");
          }
        });

      // Draw usage labels
      usageGroups
        .append("text")
        .attr("x", (d) => d.x0 + 5)
        .attr("y", (d) => d.y0 + 12)
        .attr("font-size", "12px")
        .attr("font-family", "var(--heading-font)")
        .attr("fill", "var(--main-light)")
        .text((d) => d.data.name);

      const tooltip = svg
        .selectAll("g#tooltip")
        .data([null])
        .join("g")
        .attr("id", "tooltip")
        .style("display", "none");

      tooltip
        .selectAll("rect")
        .data([""])
        .join("rect")
        .attr("fill", "var(--main-light)")
        .attr("transform", "translate(-3, -15)")
        .attr("width", 80)
        .attr("height", 40);

      tooltip
        .selectAll("text#tooltip_h")
        .data([""])
        .join("text")
        .attr("id", "tooltip_h")
        .attr("class", "tooltip_text")
        .attr("y", 0)
        .attr("font-size", 14)
        .attr("font-family", "var(--text-font)")
        .attr("fill", "var(--main-dark)")
        .attr("font-weight", "bold");

      tooltip
        .selectAll("text#tooltip_v")
        .data([""])
        .join("text")
        .attr("id", "tooltip_v")
        .attr("class", "tooltip_text")
        .attr("font-family", "var(--text-font)")
        .attr("fill", "var(--main-dark)")
        .attr("y", 18)
        .attr("font-size", 13);
      // Create legend
      const legendGroup = svg
        .selectAll("g.legend")
        .data([null])
        .join("g")
        .attr("class", "legend")
        .attr("transform", `translate(${10}, ${marginTop})`);

      legendGroup
        .selectAll("g.legend-item")
        .data(minerals, (d) => d)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", function (d, i) {
          const rownum = Math.floor(i / 8);
          return `translate(${(i % 8) * 80}, ${height - 20 - rownum * 20})`;
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
            .attr("fill", (label) => color(label));

          // Add label
          item
            .selectAll("text")
            .data([label])
            .join("text")
            .attr("x", 18)
            .attr("y", 10)
            .attr("font-size", "10px")
            .attr("fill", "var(--main-light)")
            .text((m) => m);
        });
    });
  }, [width, filename, height]);

  return <svg id="tree_graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsTreeSVG;

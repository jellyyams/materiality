import * as d3 from "d3";
import { useEffect, useRef } from "react";

const MineralsTreeSVG = (props) => {
  const ref = useRef();
  const filename = "/data/minerals_GW.csv";

  const width = props.parentWidth * 0.45;
  const height = 350;
  const marginTop = 30;
  const marginBottom = 30;
  const marginLeft = 40;
  const marginRight = 30;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg
      .selectAll("text.heading")
      .data(["heading"])
      .join("text")
      .attr("class", "heading")
      .attr("transform", "translate (30, 350) rotate(-90)")
      .attr("text-anchor", "start")
      .attr("font-size", "14px")
      .attr("fill", "var(--main-light)")
      .attr("font-family", "var(--heading-font)")
      .text("Kg of Key Minerals per MW in Data Centers");

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
      console.log(minerals);
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
        .size([width - marginLeft, height])
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
          "#0099ce",
          "#0085ff",
          "#5d5af7",
        ]);

      // Draw groups for each usage
      const usageGroups = svg
        .selectAll("g.usage")
        .data(hierarchy.children)
        .join("g")
        .attr("class", "usage")
        .attr("transform", function (d) {
          return `translate(${marginLeft}, 0)`;
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
          g.append("rect")
            .attr("width", (d) => d.x1 - d.x0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("class", (d) => d.data.name)
            .style("opacity", "0.6")
            .attr("id", (d) => d.data.symbol)
            .attr("fill", function (d) {
              return color(d.data.name);
            })
            .on("mouseover", function (event, d) {
              setTooltip(d.data, event);
              d3.selectAll(`#${d.data.symbol}`).style("opacity", 1);
            })
            .on("mousemove", function (event, d) {
              moveTooltip(event);
            })
            .on("mouseout", function (event, d) {
              hideTooltip();
              d3.selectAll(`#${d.data.symbol}`).style("opacity", 0.6);
            });
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
    });
  }, [width, filename, height]);

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default MineralsTreeSVG;

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import nodesData from "../../data/technologies.json";
import "../../styles/frame.css";


const TechnologiesSVG = (props) => {
  const ref = useRef();

  const width = (props.parentWidth * 3) / 5;
  const height = props.height;
  const base_r = 10;
  const yearStart = 2025;
  let currentYear = yearStart;
  const marginLeft = 20;
  const marginRight = 80;
  const marginBottom = 80;
  const factor = 3;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    svg
      .selectAll("text.heading")
      .data(["heading"])
      .join("text")
      .attr("class", "heading")
      .attr("x", marginLeft - 20)
      .attr("y", height - 10)
      .attr("text-anchor", "start")
      .attr("font-size", "14px")
      .attr("fill", "var(--main-light)")
      .attr("font-family", "var(--heading-font)")
      .text("Projected Global Market Size of Emerging Technologies, by Year");

    function setText(currTech) {
      let currTech_data = d3.filter(nodesData.nodes, d => d.name === currTech)[0]
      d3.select("#tech_heading").text(currTech);
      d3.select("#tech_text1").text("");
      d3.select("#tech_text2").text("");
      for(let i = 0; i <currTech_data.description.length; i++){
        d3.select(`#tech_text${i}`).text(currTech_data.description[i]);

      }

      console.log(currTech_data[0])
      d3.select("#tech_image").attr("src", `/images/${currTech_data.img_file}`).attr("class", currTech_data.img_class );
    }

    function setTooltip(hoveredTech) {
      const tooltip = d3.select(`#${hoveredTech.name.replace(/\s+/g, "_")}`);
      console.log(tooltip)
      const amount = Math.round(hoveredTech["2025"] * Math.pow(hoveredTech["growth_rate"], currentYear - yearStart))
      tooltip.style("visibility", "visible");
      tooltip.select("text").text(`${amount} Billion USD`);
    }

    function hideTooltip(tech) {
      const tooltip = d3.select(`#${tech.name.replace(/\s+/g, "_")}`);
      tooltip.style("visibility", "hidden");
    }

    let node = svg
      .selectAll("g.node")
      .data(nodesData.nodes)
      .join("g")
      .attr("class", "node");

    const links = [];
    for (let i = 0; i < nodesData.nodes.length; i++) {
      for (let j = i + 1; j < nodesData.nodes.length; j++) {
        links.push({ source: nodesData.nodes[i], target: nodesData.nodes[j] });
      }
    }


    node.each(function (d) {
      const g = d3.select(this);
      g.selectAll("circle")
        .data([
          { data: d, type: "body" },
          { data: d, type: "marketsize" },
        ])
        .join("circle")
        .attr("r", (d) => {
          return d.type === "marketsize"
            ? d.data["2025"] / (2 * Math.PI * factor)
            : base_r;
        })
        .style("fill", (d) =>
          d.type === "body" ? "none" : "var(--accent-dark)",
        )
        .attr("cursor", "pointer")
        .on("click", function (event, d) {
          setText(d.data.name);
        })
        .on("mouseover", function (event, d) {
          console.log(d);
          setTooltip(d.data);
        })
        .on("mouseout", function (event, d) {
          hideTooltip(d.data);
        });

      g.selectAll("text")
        .data([d])
        .join("text")
        .text((d) => d.name)
        .attr("fill", "var(--main-light)")
        .attr("text-anchor", "middle")
        .attr("font-family", "var(--text-font)")
        .attr("dy", (d) => (d["2025"] < 400 ? "1.5em" : "0.35em"))
        .attr("cursor", "pointer")
        .on("click", function (event, d) {
          setText(d.name);
        }).on("mouseover", function (event, d) {
          setTooltip(d);
        })
        .on("mouseout", function (event, d) {
          hideTooltip(d);
        });

      let tooltip = g
        .selectAll("g.tooltip")
        .data([d])
        .join("g")
        .attr("class", "tooltip")
        .attr("id", (d) => d.name.replace(/\s+/g, "_"))
        .style("visibility", "hidden");

      // let tooltip_div = tooltip.selectAll("div").data([d]).join("div").attr("")

      tooltip
        .selectAll("text")
        .data([d])
        .join("text")
        .attr("dy", "-0.8em")
        .attr("text-anchor", "middle")
        .attr("fill", "var(--accent-light)")
        .style("font-weight", "bold")
        .attr("class", "tooltiptext");
    });

    const calculateCollideRadius = (d, year) => {
      const size =
        (d["2025"] * Math.pow(d["growth_rate"], year - yearStart)) /
        (2 * Math.PI * factor);
      console.log(size);
      if (size < 5) {
        return size + 30;
      }
      return size + 10; // Add padding to collide radius
    };


    const link = svg
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.3);

    let simulation = d3
      .forceSimulation(nodesData.nodes)
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.01))
      .force("charge", d3.forceManyBody().strength(-30))
      .force("link", d3.forceLink(links).strength(0.005))
      .force(
        "collide",
        d3
          .forceCollide((d) => calculateCollideRadius(d, currentYear))
          .iterations(2),
      )
      .force("y", d3.forceY(height / 2).strength(0.02));

    simulation.on("tick", () => {
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
    });

    // Slider setup
    const sliderWidth = width - marginLeft - marginRight;
    const sliderY = height - marginBottom;

    const yearScale = d3
      .scaleLinear()
      .domain([yearStart, 2030])
      .range([marginLeft, marginLeft + sliderWidth])
      .clamp(true);

    // Create or update slider group
    const sliderGroup = svg
      .selectAll("g.slider")
      .data([null])
      .join("g")
      .attr("class", "slider");

    // Draw slider track
    sliderGroup
      .selectAll("line.track")
      .data([{ type: "visible" }, { type: "invisible" }])
      .join("line")
      .attr("class", "track")
      .attr("x1", marginLeft)
      .attr("x2", marginLeft + sliderWidth)
      .attr("y1", sliderY)
      .attr("y2", sliderY)
      .attr("stroke", "var(--main-light)")
      .attr("stroke-width", (d) => (d.type === "visible" ? 3 : 6))
      .attr("opacity", (d) => (d.type === "visible" ? 1 : 0))
      .attr("cursor", "pointer")
      .on("click", function (event) {
        handleClickorDrag(event);
      })
      .on("mouseover", (e) => {
        d3.select(this).raise();
      });

    // Draw ticks for each year
    const tickData = d3.range(yearStart, 2031);
    sliderGroup
      .selectAll("line.tick")
      .data(tickData, (d) => d)
      .join("line")
      .attr("class", "tick")
      .attr("x1", (year) => yearScale(year))
      .attr("x2", (year) => yearScale(year))
      .attr("y1", sliderY - 5)
      .attr("y2", sliderY + 5)
      .attr("stroke", "var(--main-light)")
      .attr("stroke-width", 1);

    // Draw year labels
    sliderGroup
      .selectAll("text.year-label")
      .data(tickData, (d) => d)
      .join("text")
      .attr("class", "year-label")
      .attr("x", (year) => yearScale(year))
      .attr("y", sliderY + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-family", "var(--text-font)")
      .attr("fill", "var(--main-light)")
      .text((year) => year);

    // Create or update draggable handle
    const handle = sliderGroup
      .selectAll("circle.handle")
      .data([currentYear])
      .join("circle")
      .attr("class", "handle")
      .attr("cx", yearScale(currentYear))
      .attr("cy", sliderY)
      .attr("r", 10)
      .attr("fill", "var(--accent-light)")
      .attr("cursor", "pointer")
      .on("mouseover", (e) => {
        d3.select(this).raise();
      });

    // Drag behavior

    const handleClickorDrag = (event) => {
      if (!ref.current) return;

      // Use d3.pointer to get coordinates relative to the SVG element
      const [svgX] = d3.pointer(event, ref.current);

      const x = Math.max(
        marginLeft,
        Math.min(svgX, marginLeft + sliderWidth),
      );

      currentYear = Math.round(yearScale.invert(x));

      handle.attr("cx", yearScale(currentYear));
      svg
        .selectAll("g.node")
        .selectAll("circle")
        .attr("r", (d) => {
          return d.type === "marketsize"
            ? (d.data["2025"] *
                d.data["growth_rate"] ** (currentYear - yearStart)) /
                (2 * Math.PI * factor)
            : base_r;
        });

      // Update collide force with new node sizes
      simulation.force(
        "collide",
        d3
          .forceCollide((d) => calculateCollideRadius(d, currentYear))
          .iterations(2),
      );
      simulation.alpha(0.3).restart();
    };

    const drag = d3.drag().on("drag", function (event) {
      handleClickorDrag(event);
    });

    handle.call(drag);

    return () => {
      simulation.stop();
    };
  });

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default TechnologiesSVG;

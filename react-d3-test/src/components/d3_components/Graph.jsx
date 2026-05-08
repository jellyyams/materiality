import * as d3 from "d3";
import { useEffect, useRef } from "react";
import nodesData from "../../data/nodes1.json";

const Graph = () => {
  const ref = useRef();
  const width = 800;
  const height = 400;

  useEffect(() => {
    const svg = d3.select(ref.current);

    let node = svg
      .selectAll("g.node")
      .data(nodesData.nodes)
      .join("g")
      .attr("class", "node");

    node.each(function(d) {
      const g = d3.select(this);
      g.selectAll("circle")
        .data([d])
        .join("circle")
        .attr("r", (d) => d.size * 10)
        .style("fill", "#69b3a2");

      g.selectAll("text")
        .data([d])
        .join("text")
        .text((d) => d.name)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");
    });

    let simulation = d3
      .forceSimulation(nodesData.nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-30));


    simulation.on("tick", () => {
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

  

    return () => {
      simulation.stop();
    };
  });

  return <svg id="graph" width={width} height={height} ref={ref}></svg>;
};

export default Graph;

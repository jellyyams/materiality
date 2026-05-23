import * as d3 from "d3";
import { useEffect, useRef } from "react";

const LoopDiagramSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth;
  const height = props.height;
  const topBottomPadding = 50; 
  const rightLeftPadding = 30; 
  const circleR = (height - (topBottomPadding * 2)) / 2

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    const data = [
      { text: "Emerging Technologies" },
      { text: "Infrastructure & Components" },
      { text: "Raw Mineral Extraction" },
      { text: "Mining 4.0" },
    ];

    const positioning = [
        {x: width / 2, y:(height / 2) - circleR}, 
        {x: (width / 2) + circleR, y:height / 2}, 
        {x: width / 2, y:(height / 2) + circleR},
        {x: (width / 2) - circleR, y:height / 2},
    ]

    const centerX = width / 2;
    const centerY = height / 2;
    const rectHalfSize = 50; // Rectangle is 100x100, so half is 50

    // Add arrowhead marker
    svg.selectAll("defs").remove();
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("refX", 9)
      .attr("refY", 3)
      .attr("orient", "auto")
      .append("polygon")
      .attr("points", "0 0, 10 3, 0 6")
      .attr("fill", "black");

    // Calculate edge points for each rectangle in clockwise order
    const edgePoints = [];
    for (let i = 0; i < data.length; i++) {
      const pos = positioning[i];
      const nextPos = positioning[(i + 1) % data.length];
      
      // Calculate vector from current to next position
      const dx = nextPos.x - pos.x;
      const dy = nextPos.y - pos.y;
      const angle = Math.atan2(dy, dx);
      
      // Start point: edge of current rectangle in direction of next
      const startX = pos.x + rectHalfSize * Math.cos(angle);
      const startY = pos.y + rectHalfSize * Math.sin(angle);
      
      // End point: edge of next rectangle in opposite direction
      const endAngle = angle + Math.PI;
      const endX = nextPos.x + rectHalfSize * Math.cos(endAngle);
      const endY = nextPos.y + rectHalfSize * Math.sin(endAngle);
      
      edgePoints.push({
        id: `arrow-${i}`,
        startX,
        startY,
        endX,
        endY,
        startPos: pos,
        endPos: nextPos,
      });
    }

    // Draw arrow paths
    svg
      .selectAll("path.arrow")
      .data(edgePoints, d => d.id)
      .join("path")
      .attr("class", "arrow")
      .attr("d", (d) => {
        // Midpoint between start and end
        const midX = (d.startX + d.endX) / 2;
        const midY = (d.startY + d.endY) / 2;
        
        // Vector from center to midpoint
        const dx = midX - centerX;
        const dy = midY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Push control point outward from center for an outward curve
        const offset = 100;
        const ctrlX = midX + (dx / dist) * offset;
        const ctrlY = midY + (dy / dist) * offset;
        
        return `M ${d.startX} ${d.startY} Q ${ctrlX} ${ctrlY} ${d.endX} ${d.endY}`;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    // Helper function (commented out since we don't need it anymore)
    // function getAngleFromCenter(pos, cx, cy) {
    //   return Math.atan2(pos.y - cy, pos.x - cx);
    // }

    svg
      .selectAll("circle")
      .data([null])
      .join("circle")
      .attr("r", 20)
      .attr("fill", "red")
      .attr("cx", width/2)
      .attr("cy", height/2);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", 100)
      .attr("height", 100)
      .attr("fill", "red")
      .attr("x", function (d, i) {
        return positioning[i].x - 50;
      })
      .attr("y", function (d, i) {
        return positioning[i].y - 50;
      });
  });
  return <svg width={width} height={height} ref={ref}></svg>;
};

export default LoopDiagramSVG;

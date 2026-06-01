import * as d3 from "d3";
import { useEffect, useRef } from "react";

const LoopDiagramSVG = (props) => {
  const ref = useRef();
  const width = props.parentWidth;
  const height = props.height;
  const topBottomPadding = 50;
  const rightLeftPadding = 30;
  const circleR = (height - topBottomPadding * 2) / 2;
  const rect_width = 250;
  const rect_height = 100;

  useEffect(() => {
    if (!ref.current || !width) return;

    const svg = d3.select(ref.current);

    const data = [
      { text: "Emerging Technologies" },
      { text: "Infrastructure & Components" },
      { text: "Raw Mineral Extraction" },
      { text: "Mining 4.0" },
    ];

    const positioning_rect = [
      { x: width / 2, y: height / 2 - circleR },
      { x: width / 2 + circleR, y: height / 2 },
      { x: width / 2, y: height / 2 + circleR },
      { x: width / 2 - circleR, y: height / 2 },
    ];

    const centerX = width / 2;
    const centerY = height / 2;
    const rect_half = Math.max(rect_height, rect_width) / 2;

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
      .attr("fill", "var(--main-light)");

    const rAdusted = circleR * 1.25;
    const positioning_arrows = [
      { x: width / 2, y: height / 2 - rAdusted },
      { x: width / 2 + rAdusted, y: height / 2 },
      { x: width / 2, y: height / 2 + rAdusted },
      { x: width / 2 - rAdusted, y: height / 2 },
    ];

    // Calculate edge points for each rectangle in clockwise order
    const edgePoints = [];
    for (let i = 0; i < data.length; i++) {
      const pos = positioning_arrows[i];
      const nextPos = positioning_arrows[(i + 1) % data.length];

      // Calculate vector from current to next position
      const dx = nextPos.x - pos.x;
      const dy = nextPos.y - pos.y;
      const angle = Math.atan2(dy, dx);

      // Start point: edge of current rectangle in direction of next
      const startX = pos.x + rect_half * Math.cos(angle);
      const startY = pos.y + rect_half * Math.sin(angle);

      // End point: edge of next rectangle in opposite direction
      const endAngle = angle + Math.PI;
      const endX = nextPos.x + rect_half * Math.cos(endAngle);
      const endY = nextPos.y + rect_half * Math.sin(endAngle);

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
      .data(edgePoints, (d) => d.id)
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
        const offset = 140;
        const ctrlX = midX + (dx / dist) * offset;
        const ctrlY = midY + (dy / dist) * offset;

        return `M ${d.startX} ${d.startY} Q ${ctrlX} ${ctrlY} ${d.endX} ${d.endY}`;
      })
      .attr("stroke", "var(--main-light)")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    const groups = svg
      .selectAll("g.rect")
      .data(data, d => d)
      .join("g")
      .attr("class", "rect")
      .each(function (d, i) {
        d3.select(this).selectAll("rect")
          .data([d])
          .join("rect")
          .attr("width", rect_width)
          .attr("height", rect_height)
          .attr("fill", "var(--accent-light)")
          .attr("x", function (d) {
            return positioning_rect[i].x - rect_width / 2;
          })
          .attr("y", function (d) {
            return positioning_rect[i].y - rect_height / 2;
          });

          d3.select(this).selectAll("text")
          .data([d])
          .join("text")
          .attr("fill", "var(--main-dark)")
          .attr("text-anchor", "center")
          .attr("x", function(d){
            return positioning_rect[i].x - rect_width / 2 + 12;
          })
          .attr("y", function(d){
            return positioning_rect[i].y + 4 ;
          })
          .text(d => d.text);


      });
  });
  return <svg width={width} height={height} ref={ref}></svg>;
};

export default LoopDiagramSVG;

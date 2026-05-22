import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import Graph from "../d3_components/TechnologiesSVG";

export default function Frame1() {
  const frameRef = useRef();
  const [frameWidth, setFrameWidth] = useState(0);

  useEffect(() => {
    // Initialize width on mount
    if (frameRef.current) {
      setFrameWidth(frameRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (frameRef.current) {
        setFrameWidth(frameRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="frame" ref={frameRef}>
      <h1>Emerging Technologies for the Digital Transformation</h1>
      <p>This is some text for the first page</p>
      <Graph parentWidth={frameWidth}/>
    </div>
  );
}

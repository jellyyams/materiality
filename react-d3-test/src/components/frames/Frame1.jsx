import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import Graph from "../d3_components/TechnologiesSVG";

export default function Frame1() {
  const frameRef = useRef();
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
  const [currTech, setCurrTech] = useState("All");
  const [currYear, setCurrYear] = useState(2025);

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
      <div className="flexParent">
        <Graph parentWidth={frameWidth} height={590} />
        <div className="smallColumn2">
          <h2 id="tech_heading"></h2>
          <p id="tech_text">Emerging technologies are asldf asdlf alkkldjf asldfkjl adslfk;j; ;lkjadfs </p>
        </div>
      </div>
    </div>
  );
}

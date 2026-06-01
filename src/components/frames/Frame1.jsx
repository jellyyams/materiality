import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import Graph from "../d3_components/TechnologiesSVG";

export default function Frame1() {
  const frameRef = useRef();
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameHeight, setFrameHeight] = useState(0);
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
      <h1>Market Size of Emerging Technologies</h1>
      <div className="flexParent">
        <Graph parentWidth={frameWidth} height={450} />
        <div className="smallColumn2">
          <h2 id="tech_heading">Invest Now!</h2>
          <p id="tech_text0">
            In 2025, seven emerging technologies saw
            an estimated market size of <b>3.3 trillion usd</b>. Collectively, that
            exceeds the market size of the entire global aviation industry and
            automobile industries combined. According to estimated compound
            annual growth rates (CAGR), these industries are only projected to
            grow, with a collective market size reaching <b>7.2 trillion usd</b> by
            2030. 
          </p>
          <p id="tech_text1">These numbers might not mean much to the average layperson,
            but for investors, business leaders, and other major economic
            players, it signals a belief that these industries will command
            enormous demand in the next 5 years, and that it’s important to
            invest in them today.</p>

          <p id="tech_text2">Click on each technology bubble on the left to read more.</p>
          <img id="tech_image" src={`${import.meta.env.BASE_URL}images/server.png.webp`} className="sticky_img_bot_right_small"></img>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import "../../styles/frame3.css";
import mineralData from "../../data/minerals.json";
import MineralsLineSVG from "../d3_components/MineralsLineSVG";
import MineralsBarSVG from "../d3_components/MineralsBarSVG";
import TextContent from "../components/TextContent";

export default function Frame3() {
  const [currMineral, setCurrMineral] = useState("All Minerals");
  const [currDescription, setDescription] = useState("no description");
  const [frameWidth, setFrameWidth] = useState(0);

  const frameRef = useRef();
  const mineralNames = Object.keys(mineralData.minerals);
  console.log(mineralNames);

  function SelectedSubframe() {
    switch (currMineral) {
      case "All Minerals":
        return <TextContent data={mineralData.minerals["All Minerals"]}/>;
      default:
        return (
          <div className="flexRow2">
            <TextContent data={mineralData.minerals[currMineral]}/>;
            <MineralsBarSVG
              currMineral={currMineral}
              parentWidth={frameWidth}
            />
          </div>
        );
    }
  }

  function MineralButtons() {
    return mineralNames.map((name) => {
      return (
        <p
          className={currMineral === name ? "clickable_selected" : "clickable"}
          onClick={() => handleClick(name)}
        >
          {name}
        </p>
      );
    });
  }

  function handleClick(name) {
    setCurrMineral(name);
  }

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
      <h1>Mineral Extraction for Emerging Technology Infrastructures</h1>

      <div className="flexRow">
        <MineralButtons />
      </div>
      <div className="textSubframe">
        <SelectedSubframe />
      </div>
    </div>
  );
}

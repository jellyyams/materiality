import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import mineralData from "../../data/minerals.json";
import MineralsLineSVG from "../d3_components/MineralsLineSVG";
import MineralsBarSVG from "../d3_components/MineralsBarSVG";

export default function Frame3() {
  const [currMineral, setCurrMineral] = useState("All Minerals");
  const [currDescription, setDescription] = useState("no description");
  const [frameWidth, setFrameWidth] = useState(0);

  const frameRef = useRef();

  function SelectedSubframe() {
    switch (currMineral) {
      case "All Minerals":
        return <p>This frame is about all minerals</p>;
      default:
        return (
          <div className="flexRow2">
            <div>
              <p>{currDescription}</p>
            </div>
            <MineralsBarSVG
              currMineral={currMineral}
              parentWidth={frameWidth}
            />
          </div>
        );
    }
  }

  function handleClick(name) {
    setCurrMineral(name);
    let data = mineralData.minerals.filter((mineral) => mineral.name === name);
    setDescription(data[0].description);
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
        {mineralData &&
          mineralData.minerals.map((i) => {
            return (
              <p className="clickable" onClick={() => handleClick(i.name)}>
                {i.name}
              </p>
            );
          })}
      </div>
      <div className="mineralSubframe">
        <SelectedSubframe />
      </div>
    </div>
  );
}

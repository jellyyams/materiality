import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";
import mineralData from "../../data/minerals.json"; 
import MineralsLineSVG from "../d3_components/MineralsLineSVG";
import MineralsBarSVG from "../d3_components/MineralsBarSVG";

export default function Frame3() {
    const [currMineral, setCurrMineral] = useState("Copper"); 

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
      <h1>
        Mineral Extraction for Emerging Technology Infrastructures
      </h1>
      <div className="flexRow">
        {mineralData && mineralData.minerals.map(i => {return <p onClick={() =>{setCurrMineral(i.name)}}>{i.name}</p>})}
      </div>
      <div>
        {/* <MineralsLineSVG currMineral={currMineral} parentWidth={frameWidth}/> */}
        <MineralsBarSVG currMineral={currMineral} parentWidth={frameWidth}/>

      </div>
      
    </div>
  );
}

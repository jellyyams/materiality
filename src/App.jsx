import { useEffect, useState } from "react";
import Frame1 from "./components/frames/Frame1";
import Frame2 from "./components/frames/Frame2";
import Frame3 from "./components/frames/Frame3";
import Frame4 from "./components/frames/Frame4";
import Frame5 from "./components/frames/Frame5";
import SideTracker from "./components/SideTracker";
import LoopDiagramSVG from "./components/d3_components/LoopDiagramSVG";
import "./App.css";

function App() {
  const [frameNum, setFrame] = useState(1);

  const handleScroll = () => {
    console.log(window.scrollY);
    console.log(document.documentElement.scrollTop);
    console.log(window.pageYOffset);
    console.log("scrolled");
  };

  function nextFrame(){
    if(frameNum > 4){
      setFrame(1)
    } else {
      setFrame(frameNum + 1)
    }
  }

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  });

  function SelectedFrame() {
    switch (frameNum) {
      case 1:
        return <Frame1 />;
      case 2:
        return <Frame2 setFrame={setFrame} />;
      case 3:
        return <Frame3 />;
      case 4:
        return <Frame4 />;
      case 5:
        // return <div className="loop_svg"><LoopDiagramSVG parentWidth = {1000} height = {800}/></div>;
        return <Frame5 setFrame={setFrame} />;
      default:
        return <Frame1 />;
    }
  }

  function Arrows() {
    switch (frameNum) {
      case 1:
        return (
          <>
            <img
              className="largeArrowLeft"
              alt="a large arrow"
              src="/images/dashed_arrow_large.png"
            ></img>
            <img
              className="largeArrowRight"
              alt="a large arrow"
              src="/images/solid_arrow_large.png"
            ></img>
          </>
        );
      case 2:
        return (
          <>
            <img
              className="largeArrowTop"
              alt="a large arrow"
              src="/images/solid_arrow_large.png"
            ></img>
            <img
              className="largeArrowBottom"
              alt="a large arrow"
              src="/images/solid_arrow_large.png"
            ></img>
          </>
        );
      case 3: 
      return (
          <>
            <img
              className="largeArrowRightBottom"
              alt="a large arrow"
              src="/images/solid_arrow_large.png"
            ></img>
            <img
              className="largeArrowLeftBottom"
              alt="a large arrow"
              src="/images/dashed_arrow_large.png"
            ></img>
          </>
        );

      case 4:
        return (
          <>
            <img
              className="largeArrowTopLeft"
              alt="a large arrow"
              src="/images/dashed_arrow_large.png"
            ></img>
            <img
              className="largeArrowBottomLeft"
              alt="a large arrow"
              src="/images/dashed_arrow_large.png"
            ></img>
          </>
        );
      default:
        <></>;
    }
  }

  return (
    <div className="App">
      <div className="frame_and_arrows">
        <div className="arrows">
          <Arrows />

        </div>
        
        <div key={frameNum} className="fade-in-frame">
          <SelectedFrame />
        </div>
      </div>
      <SideTracker currFrame={frameNum} setFrame={setFrame} />
    </div>
  );
}

export default App;

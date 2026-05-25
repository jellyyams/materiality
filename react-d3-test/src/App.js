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
    console.log(window.scrollY)
    console.log(document.documentElement.scrollTop)
    console.log(window.pageYOffset)
    console.log("scrolled")

  }

  useEffect(() => {
    window.addEventListener("wheel", handleScroll)
    return () => window.removeEventListener("wheel", handleScroll)
  })

  function SelectedFrame() {
    switch (frameNum) {
      case 1:
        return <Frame1 />;
      case 2:
        return <Frame2 setFrame={setFrame}/>;
      case 3:
        return <Frame3 />;
      case 4:
        return <Frame4 />;
      case 5:
        // return <div className="loop_svg"><LoopDiagramSVG parentWidth = {1000} height = {800}/></div>;
        return <Frame5 setFrame={setFrame}/>;
      default:
        return <Frame1 />;
    }
  }

  return (
    <div className="App">
      <div>
        <SelectedFrame />
      </div>
      <SideTracker currFrame={frameNum} setFrame={setFrame}/>
    </div>
  );
}

export default App;

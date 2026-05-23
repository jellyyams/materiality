import { useState } from "react";
import Frame1 from "./components/pages/Frame1";
import Frame2 from "./components/pages/Frame2";
import Frame3 from "./components/pages/Frame3";
import Frame4 from "./components/pages/Frame4";
import LoopDiagramSVG from "./components/d3_components/LoopDiagramSVG";
import "./App.css";

function App() {
  const [frameNum, setFrame] = useState(0);
  function handleClick() {
    if (frameNum > 3) {
      setFrame(0);
    } else {
      setFrame((f) => f + 1);
    }
  }

  function SelectedFrame() {
    switch (frameNum) {
      case 0:
        return <Frame1 />;
      case 1:
        return <Frame2 />;
      case 2:
        return <Frame3 />;
      case 3:
        return <Frame4 />;
      case 4:
        return <LoopDiagramSVG parentWidth = {1000} height = {700}/>;
      default:
        return <Frame1 />;
    }
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Frame number: {frameNum} </button>
      <div>
        <SelectedFrame />
      </div>
    </div>
  );
}

export default App;

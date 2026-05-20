import { useState } from "react";
import Frame1 from "./components/pages/Frame1";
import Frame2 from "./components/pages/Frame2";
import Frame3 from "./components/pages/Frame3";
import Frame4 from "./components/pages/Frame4";
import "./App.css";

function App() {
  const [frame_num, setFrame] = useState(0);
  function handleClick() {
    if (frame_num > 3) {
      setFrame(0);
    } else {
      setFrame((f) => f + 1);
    }
  }

  function SelectedFrame() {
    switch (frame_num) {
      case 0:
        return <Frame1 />;
      case 1:
        return <Frame2 />;
      case 2:
        return <Frame3 />;
      case 3:
        return <Frame4 />;
      case 4:
        return <p>Case 4</p>;
      default:
        return <Frame1 />;
    }
  }

  return (
    <div className="App">
      <button onClick={handleClick}>Frame number: {frame_num} </button>
      <div>
        <SelectedFrame />
      </div>
    </div>
  );
}

export default App;

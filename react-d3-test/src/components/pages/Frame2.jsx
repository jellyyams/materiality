import { useEffect, useState } from "react";
import "../../styles/frame.css";

export default function Frame2() {
  const [subframeNum, setSubframe] = useState("data_centers");
  function SelectedSubframe() {
    switch (subframeNum) {
      case "data_centers":
        return <p>This is about data centers</p>;
      case "energy":
        return <p>This is about energy</p>;
      case "cabling":
        return <p>This is about cabling</p>;
      case "chips":
        return <p>This is about chips</p>;
      default:
        return <p>Hello there 5</p>;
    }
  }

  return (
    <div className="frame">
      <h1>
        Material Infrastructures and Components needed for emerging technologies
      </h1>
      <div className="flexParent">
        <div className="smallColumn">
          <p>
            To support the projected growth and investment in emerging
            technologies, enormous scales of material infrastructure need to be
            invested in as well, all the way from raw material extraction to
            data center construction.
          </p>
          <div className="smallRow">
            <p onClick={() => setSubframe("energy")} id="energy">Energy Infrastructure</p>
            <p onClick={() => setSubframe("data_centers")} id="data_centers">Data Centers</p>

            <div>
              <p onClick={() => setSubframe("cabling")} id="cabling">
                Cabling Infrastructure
              </p>
              <p onClick={() => setSubframe("chips")} id="chips">Chips Manufacturing</p>
            </div>
          </div>
        </div>
        <div className="bigColumn">
          <SelectedSubframe />
        </div>
      </div>
      <div className="rawMaterialsButton"><p>Raw materials</p></div>
    </div>
  );
}

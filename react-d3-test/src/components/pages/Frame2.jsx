import { useEffect, useState } from "react";
import "../../styles/frame.css";

export default function Frame2() {
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
          <div>
            <p>Data Centers</p>
            <p>Energy Infrastructure</p>
            <p>Cabling Infrastructure</p>
            <p>Chips Manufacturing</p>

          </div>
        </div>
        <div className="bigColumn">
            <p>This is a test </p>
        </div>
      </div>
      <span>Raw materials</span>
    </div>
  );
}

import { useEffect, useState } from "react";
import "../../styles/frame.css";
import "../../styles/frame5.css";

export default function Frame5(props) {
  return (
    <div>
      <div className="boxes">
        <div className="box_top" onClick={() => props.setFrame(1)}>
          <h3 className="color2">Emerging Technologies</h3>
        </div>
        <div className="box_right" onClick={() => props.setFrame(2)}>
          <h3 className="color1">Infrastructure & Components</h3>
        </div>
        <div className="box_bottom"  onClick={() => props.setFrame(3)}>
          <h3 className="color1">Raw Mineral Extraction</h3>
        </div>
        <div className="box_left"  onClick={() => props.setFrame(4)}>
          <h3 className="color2">Mining 4.0</h3>
        </div>

        <img className="top_left" src="/images/dashed_arrow.png"></img>
        <img className="bottom_right" src="/images/dashed_arrow.png"></img>
        <img className="top_right" src="/images/solid_arrow.png"></img>
        <img className="bottom_left" src="/images/solid_arrow.png"></img>
      </div>
      <div className="center">
        <p>
          Main text about this loop/ How much text can I fit in here before it
          stops
        </p>
      </div>
    </div>
  );
}

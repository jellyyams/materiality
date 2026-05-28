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
        <div className="box_bottom" onClick={() => props.setFrame(3)}>
          <h3 className="color1">Raw Mineral Extraction</h3>
        </div>
        <div className="box_left" onClick={() => props.setFrame(4)}>
          <h3 className="color2">Mining 4.0</h3>
        </div>

        <img className="top_left" src="/images/dashed_arrow.png"></img>
        <img className="bottom_right" src="/images/dashed_arrow.png"></img>
        <img className="top_right" src="/images/solid_arrow.png"></img>
        <img className="bottom_left" src="/images/solid_arrow.png"></img>
      </div>
      <div className="center_text">
        <h2>The Technology Treadmill</h2>
        <p>
          In order to meet the growing demand for critical minerals, the mining
          sector will need to leverage cutting edge technologies such as AI,
          drones, and autonomous robotics. These technologies will cut costs,
          improve efficiency, and make it easier to find and exploit mineral
          deposits. The mining sector is just one of many industries banking on
          the cost-saving and efficiency-improving potential of emerging
          technologies– just looking at the market size projections, we can tell
          that there will be enormous demand for these technologies. In order to
          capitalize on these market projections, we need to build out
          infrastructural capacity including data centers, chips manufacturing
          operations, and power generation and grid infrastructure.
          Unfortunately all of these infrastructures require large quantities of
          key metals and minerals, many of which are becoming harder to exploit
          due to degrading ore quality and other environmental or geopolitical factors. In order
          to meet the growing demand for critical minerals, the mining sector
          will need to leverage cutting edge technologies such as.....
        </p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import "../../styles/frame.css";
import "../../styles/frame4.css";
export default function Frame4() {
  return (
    <div className="frame">
      <h1>Mining 4.0 and 5.0: The Future of Mining</h1>
      <div className="textSubframeBlue">
        <div className="text_only">
          <p>
            In order to address the growing deficit for critical minerals needed
            to support expanding technological infrastructures, some have been
            advocating for a transition to Mining 4.0. First gaining mainstream
            usage around 2015, Mining 4.0 refers to integration of advanced
            digital technologies such as IoT sensors, AI, digital twins,
            autonomous vehicles, advanced analytics, and drones into mining
            operations.
          </p>
          <p>
            For example, industrial <b>IoT networks</b> can transmit and analyze
            data collected in real time about mining operations, allowing remote
            and autonomous monitoring of operations to identify inefficiencies,
            optimize production processes, and respond quickly to potential
            problems. <b>Digital twins</b> can be used to create virtual models
            of operations, enabling simulations to improve planning and
            operational efficiency. <b>Autonomous machinery and robots</b> can
            handle heavy material extraction without human intervention.{" "}
            <b>AI</b> can be leveraged to analyze satellite imagery and seismic
            data to identify high-potential resource deposits, or take over
            decision making processes as part of the mine’s operations.
          </p>
          <p>
            Proponents believe that Mining 4.0 will usher in a new era of
            efficiency, safety, and environmental sustainability for the mining
            industry. Transitioning to smart Mining operations will be able to
            save costs, more effectively extract material, lower the safety risk
            to human workers, and attract younger generations to the industry.
          </p>
          <p>
            More recently, some have started using the term <b>Mining 5.0</b> to
            describe bridging digital and automation technologies with
            human-centric operations.
          </p>
        </div>

        <img className="img_1" src={"/images/Mining1.webp"}></img>
        <img className="img_2" src={"/images/Mining4.png"}></img>
        <img className="img_4" src={"/images/robotics_mining.jpg"}></img>
      </div>
    </div>
  );
}

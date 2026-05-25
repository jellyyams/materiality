import { useEffect, useState } from "react";
import "../../styles/frame.css";
import EnergyChartSVG from "../d3_components/EnergyChartSVG";
import StackedLineSVG from "../d3_components/StackedLineSVG";
import TextContent from "../components/TextContent";
import textData from "../../data/infrastructures.json";

export default function Frame2(props) {
  const [subFrame, setSubframe] = useState("data_centers");
  function SelectedSubframe() {
    switch (subFrame) {
      case "data_centers":
        return (
          <div className="flexRow2">
            <TextContent
              title="Data Centers"
              data={textData.infrastructures.data_centers}
            />
            <StackedLineSVG parentWidth="400" height="400" />
          </div>
        );
      case "energy":
        return (
          <div className="flexRow2">
            <TextContent
              title="Energy Infrastructure"
              data={textData.infrastructures.energy}
            />
            <EnergyChartSVG parentWidth="400" height="400" />
          </div>
        );
      case "cabling":
        return (
          <div className="flexRow2">
            <TextContent
              title="Cabling Infrastructure"
              data={textData.infrastructures.cabling}
            />
            
          </div>
        );
      case "chips":
        return (
          <div className="flexRow2">
            <TextContent
              title="Chips Manufacturing"
              data={textData.infrastructures.chips}
            />
            
          </div>
        );
      default:
        return (
          <div className="flexRow2">
            <TextContent
              title="Data Centers"
              data={textData.infrastructures.data_centers}
            />
            <StackedLineSVG parentWidth="400" height="400" />
          </div>
        );
    }
  }

  return (
    <div className="frame">
      <h1>
        Material Infrastructures and Components needed for emerging technologies
      </h1>
      <div className="flexParent">
        <div className="smallColumn1">
          <p>
            To support the projected growth and investment in emerging
            technologies, enormous scales of material infrastructure need to be
            invested in as well, all the way from raw material extraction to
            data center construction.
          </p>
          <div className="buttonsCol">
            <p
              className={subFrame === "energy" ? "selected_label" : ""}
              onClick={() => setSubframe("energy")}
              id="energy"
            >
              Energy Infrastructure
            </p>
            <p
              className={
                subFrame === "data_centers"
                  ? "dataCentersButton_selected"
                  : "dataCentersButton"
              }
              onClick={() => setSubframe("data_centers")}
              id="data_centers"
            >
              Data Centers
            </p>

            <div className="rowFlex">
              <p
                className={subFrame === "cabling" ? "selected_label" : ""}
                onClick={() => setSubframe("cabling")}
                id="cabling"
              >
                Cabling Infrastructure
              </p>
              <p
                className={subFrame === "chips" ? "selected_label" : ""}
                onClick={() => setSubframe("chips")}
                id="chips"
              >
                Chips Manufacturing
              </p>
            </div>
          </div>
        </div>
        <div className="bigColumn">
          <SelectedSubframe />
        </div>
      </div>
      <div onClick={() => props.setFrame(3)} className="rawMaterialsButton">
        <p>Raw materials</p>
      </div>
    </div>
  );
}

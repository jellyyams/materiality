import { useEffect, useState } from "react";
import "../../styles/frame.css"
import Graph from "../d3_components/Graph";

export default function Frame1() {
    return (
        <div className="frame">
            <h1>Emerging Technologies for the Digital Transformation</h1>
            <p>This is some text for the first page</p>
            <Graph />

        </div>
    )
}
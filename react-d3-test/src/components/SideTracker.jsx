import { useEffect, useState, useRef } from "react";
import "../styles/tracker.css";

export default function SideTracker(props) {
  return (
    <div className="dots">
      <span
        className={props.currFrame === 1 ? "dot_blue_selected" : "dot_blue"}
        id="1"
        onClick={() => props.setFrame(1)}
      ></span>
      <span
        className={props.currFrame === 2 ? "dot_pink_selected" : "dot_pink"}
        id="2"
        onClick={() => props.setFrame(2)}
      ></span>
      <span
        className={props.currFrame === 3 ? "dot_pink_selected" : "dot_pink"}
        id="3"
        onClick={() => props.setFrame(3)}
      ></span>
      <span
        className={props.currFrame === 4 ? "dot_blue_selected" : "dot_blue"}
        id="4"
        onClick={() => props.setFrame(4)}
      ></span>
      <span
        className={props.currFrame === 5 ? "dot_white_selected" : "dot_white"}
        id="5"
        onClick={() => props.setFrame(5)}
      ></span>
      
    </div>
  );
}

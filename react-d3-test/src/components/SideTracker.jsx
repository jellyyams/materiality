import { useEffect, useState, useRef } from "react";
import "../styles/tracker.css";

export default function SideTracker(props) {
  return (
    <div className="dots">
      <span
        className={props.currFrame === 1 ? "dot_selected" : "dot"}
        id="1"
        onClick={() => props.setFrame(1)}
      ></span>
      <span
        className={props.currFrame === 2 ? "dot_selected" : "dot"}
        id="2"
        onClick={() => props.setFrame(2)}
      ></span>
      <span
        className={props.currFrame === 3 ? "dot_selected" : "dot"}
        id="3"
        onClick={() => props.setFrame(3)}
      ></span>
      <span
        className={props.currFrame === 4 ? "dot_selected" : "dot"}
        id="4"
        onClick={() => props.setFrame(4)}
      ></span>
      <span
        className={props.currFrame === 5 ? "dot_selected" : "dot"}
        id="5"
        onClick={() => props.setFrame(5)}
      ></span>
      
    </div>
  );
}

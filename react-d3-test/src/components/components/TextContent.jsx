import { useEffect, useState, useRef } from "react";
import "../../styles/frame.css";

export default function TextContent(props) {
    console.log(props.data)
    function Paragraphs(){
        return(
            props.data.paragraphs.map((text) => {
                return(
                    <p>{text}</p>
                )
            })
        )

    }
    return(
        <div>
            <h2>
                {props.title}
            </h2>

            <Paragraphs />

        </div>
    )
}
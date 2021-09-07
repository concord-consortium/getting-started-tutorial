/**
 * A simple component for displaying a clickable link to help
 **/
import React from "react";
import {parameters} from "./vs-constants";

export function HelpLink(props:{ helpURL:string, handleHelpClick:any}) {
	return (
		<span className="GettingStartedTutorial-help"
					onClick={()=>{
						props.handleHelpClick(props.helpURL);
					}}
		>
			{parameters.showMePrompt}
		</span>
	);
}
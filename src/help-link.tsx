/**
 * A simple component for displaying a clickable link to help
 **/
import React from "react";

export function HelpLink(props:{ helpURL:string, handleHelpClick:any}) {
	return (
		<span className="WeatherxTutorial-help"
					onClick={()=>{
						props.handleHelpClick(props.helpURL);
					}}
		>
			Show me
		</span>
	);
}
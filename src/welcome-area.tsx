import React from "react";
import {parameters} from "./wx-constants";

export interface WelcomeProps {
	movieURL: string,
	feedbackText: string,
	whichFeedback: string,
	handleEnded: any
}

export function WelcomeArea(props:WelcomeProps) {
	let tResult:any;
	switch (props.whichFeedback) {
		case 'welcome':
			tResult = (
				<div className="GettingStartedTutorial-header-welcome">
					<h2>{parameters.title}</h2>
					{parameters.welcomeText}
				</div>
			);
			break;
		case 'movie':
			tResult = (
				<div className="GettingStartedTutorial-header-movie">
					<video id="movieVideo" className="GettingStartedTutorial-movie" autoPlay onEnded={props.handleEnded}>
						<source src={props.movieURL} type="video/mp4"/>
					</video>
				</div>
			);
			break;
		case 'feedback':
			tResult = (
				<div className="GettingStartedTutorial-header-feedback">
					{props.feedbackText}
				</div>
			);
			break;
		default:
			tResult = (
				<div className="GettingStartedTutorial-header-empty"/>
			);
	}
	return tResult;
}
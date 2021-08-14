/**
 * An empty moment is a placeholder for when user deletes all normal moments. Clicking creates a new normal moment.
 **/
import React from "react";

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
				<div className="WeatherxTutorial-header-welcome">
					<img src={'./resources/codap_logo.png'} className="WeatherX-logo" alt="logo"/>
					<h2>WeatherX CODAP Tutorial</h2>
				</div>
			);
			break;
		case 'movie':
			tResult = (
				<div className="WeatherxTutorial-header-movie">
					<video id="movieVideo" className="WeatherxTutorial-movie" autoPlay onEnded={props.handleEnded}>
						<source src={props.movieURL} type="video/mp4"/>
					</video>
				</div>
			);
			break;
		case 'feedback':
			tResult = (
				<div className="WeatherxTutorial-header-feedback">
					{props.feedbackText}
				</div>
			);
			break;
		default:
			tResult = (
				<div className="WeatherxTutorial-header-empty"/>
			);
	}
	return tResult;
}
/**
 * An empty moment is a placeholder for when user deletes all normal moments. Clicking creates a new normal moment.
 **/
import React from "react";
import {HelpLink} from "./help-link";
import {TaskDescription} from "./wx-constants";

export interface TaskListProps {
	descriptions: TaskDescription[],
	handleHelpClick: any,
	accomplished: string[]
}

export function TaskList(props: TaskListProps) {
	let checkBoxes = props.descriptions.map((iAction) => {
		let tChecked = props.accomplished.indexOf(iAction.key) >= 0;
		return (
			<div key={iAction.key}>
				<input className="GettingStartedTutorial-checkbox"
							 type="checkbox"
							 onClick={function () {
								 return false;
							 }} name={iAction.key}
							 checked={tChecked}
							 readOnly={true}
				/>
				{iAction.label} <HelpLink
				helpURL={iAction.url}
				handleHelpClick={props.handleHelpClick}/> <br/>
			</div>
		);
	});
	return (
		<div className="GettingStartedTutorial-list">
			{checkBoxes}
		</div>
	);
}
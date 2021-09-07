/**
 * This list of tasks contains descriptions of tasks the user is asked to complete
 **/
import React, {ReactElement} from "react";

export interface TaskDescription {
	key: string,
	label: string | ReactElement,
	url: string,
	feedback: ReactElement,
	alt_feedback?: ReactElement,
	operation: string,
	renameType?: string,	// For when a task is a rename of a particular type of component
	componentTypeArray?: string[],
	attributeNameArray?:string[],
	axisOrientation?:string,
	collectionName?:string,	// For selecting from a specific collection
	noneSelected?:boolean,
	moreThanOneSelected?:boolean,
	prereq?: string,
	testMethodName?:string
}

export interface TaskDescriptionsObject {
	descriptions: TaskDescription[],
	getFeedbackFor: (iKey: string, iUseAltFeedback: boolean, iAllAccomplished: boolean) => string,
	taskExists: (iKey: string) => boolean
}

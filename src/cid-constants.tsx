/**
 * This list of tasks contains descriptions of tasks the user is asked to complete
 **/
import React, {ReactElement} from "react";
import {TaskDescription, TaskDescriptionsObject} from "./task-types";

export const parameters = {
	short_name: 'Detectives',
	name: 'Data Detectives Tutorial',
	title: 'Data Detectives CODAP Tutorial',
	welcomeText: <p>Learn how to make and manipulate graphs in CODAP.</p>,
	packageName: 'cidsee-tutorial',
	version: '0.9',
	initialDimensions: {
		width: 400,
		height: 485
	},
	intro1: <p>Figure out how to accomplish each of these basic CODAP tasks:</p>,
	intro2: '',
	showMePrompt: 'Show me'
}

export const taskDescriptions: TaskDescriptionsObject = {
	descriptions: [
		{
			key: 'MakeGraph',
			label: 'Make a graph',
			url: './resources/cid/cid_MakeGraph.mp4',
			operation: 'create',
			componentTypeArray: ['graph'],
			feedback: (
				<div>
					<p>Very nice graph! Each point represents one of the cases in your data set.</p>
					<p>The points are scattered randomly for the moment because you haven't
						yet specified how they should be arranged.</p>
				</div>
			)
		},
		{
			key: 'WhenXAxis',
			label: 'Drag the attribute "Date" to a graph\'s x-axis',
			url: './resources/cid/cid_DateXAxis.mp4',
			operation: 'attributeChange',
			attributeNameArray: ['Date'],
			axisOrientation: 'horizontal',
			feedback: (
				<div>
					<p>Way to go! You dragged the <strong>Date</strong> attribute to the graph's x-axis.</p>
					<p>Now the points have arranged themselves along the axis according to their date.</p>
				</div>
			)
		},
		{
			key: 'TotalInfectionsYAxis',
			label: 'Drag "Total Infections" to the graph\'s y-axis',
			url: './resources/cid/cid_TotalInfectionsYAxis.mp4',
			operation: 'attributeChange',
			attributeNameArray: ['Total infections'],
			axisOrientation: 'vertical',
			feedback: (
				<div>
					<p>Alright! You dragged Total infections to the graph's y-axis.</p>
					<p>Now the points have arranged themselves in a time series scatter plot.</p>
				</div>
			)
		},
		{
			key: 'changeGraphTitle',
			label: 'Change the title of your graph',
			url: './resources/cid/cid_changeGraphTitle.mp4',
			operation: 'titleChange',
			renameType: 'graph',
			feedback: (
				<div>
					<p>Way to go! You changed the graph's name.</p>
					<p>Changing the name of a graph can help you keep track of your investigation
						and help others understand what you have done.</p>
				</div>
			)
		},
		{
			key: 'SelectCountry',
			label: 'Click on one of the country names in the table',
			url: './resources/cid/cid_SelectCountry.mp4',
			operation: 'selectCases',
			collectionName: 'Countries',
			feedback: (
				<div>
					<p>You've selected a Country.</p>
					<p>When you click on a row it highlights all the cases in all the graphs as well.</p>
					<p>When a top level case like a Country is selected, all its child level cases like these Observations are
						also selected.</p>
				</div>
			)
		},
		{
			key: 'DeselectAll',
			label: 'Deselect all cases by clicking on white space in the middle of the graph',
			url: './resources/cid/cid_DeselectAll.mp4',
			operation: 'selectCases',
			noneSelected: true,
			prereq: 'SelectCountry',
			feedback: (
				<div>
					<p>You did it—deselecting all cases!</p>
					<p>You can also deslect by clicking in the table's white space.</p>
					<p>Selecting cases is <em>very</em> useful. Deselecting all cases is, too, to
						simplify things.</p>
				</div>
			)
		},
		{
			key: 'DropCountry',
			label: 'Drag Country into the middle of the graph',
			url: './resources/cid/cid_DropCountry.mp4',
			operation: 'legendAttributeChange',
			attributeNameArray: ['Country'],
			feedback: (
				<div>
					<p>Fantastic! The six countries show up in the graph's legend. And each country's points
						get a different color.</p>
					<p>You can even change the colors using the graph's <em>paintbrush</em> menu.</p>
				</div>
			)
		},
		{
			key: 'LegendClick',
			label: 'Click on one of the legend symbols',
			url: './resources/cid/cid_LegendClick.mp4',
			operation: 'selectCases',
			prereq: 'DropCountry',
			moreThanOneSelected: true,
			feedback: (
				<div>
					<p>Easy, right? Clicking on a legend symbol not only selects its points, but it also
						brings those points to the front so they aren't covered up by other points.</p>
					<p>You can also click and drag the legend symbols to change their order.</p>
				</div>
			)
		},
		{
			key: 'HideUnselected',
			label: 'Use the graph\'s eyeball menu to hide the unselected cases',
			url: './resources/cid/cid_HideUnselected.mp4',
			operation: 'hideUnselected',
			feedback: (
				<div>
					<p>That's perfect! Hiding cases in a graph is a way to filter out the data you aren't
						interested in for the moment.</p>
					<p>The eyeball menu also has a <em>Show All Cases</em> command to bring back the hidden cases.</p>
					<p>Sometimes you'll want to use the graph's rescale icon (top of panel) so that the points fit nicely in
						the graph.</p>
				</div>
			)
		}
	],
	getFeedbackFor: (iKey: string, iUseAltFeedback?: boolean): any => {
		let tDesc = taskDescriptions.descriptions.find(function (iDesc) {
			return iKey === iDesc.key;
		});
		return tDesc ? (iUseAltFeedback ? tDesc.alt_feedback : tDesc.feedback) : '';
	},
	taskExists: (iKey: string): boolean => {
		return taskDescriptions.descriptions.some(function (iDesc) {
			return iKey === iDesc.key;
		});
	}
}

export const allAccomplishedFeedback = (
	<div>
		<p>Congratulations! You've completed all {taskDescriptions.descriptions.length} tasks.</p>
		<p>You can do a <em>lot</em> in CODAP with just the skills you've practiced!</p>
		<p>Before you quit, spend some more time with this Covid-19 infections data to see what you
				can discover.</p>
	</div>
)
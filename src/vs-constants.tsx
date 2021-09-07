/**
 * This list of tasks contains descriptions of tasks the user is asked to complete
 **/
import React, {ReactElement} from "react";
import {TaskDescription, TaskDescriptionsObject} from "./task-types";

export const parameters = {
	short_name: 'Vital Signs',
	name: 'GMRI Intertidal Crabs Tutorial',
	title: 'GMRI Intertidal Crabs CODAP Tutorial',
	welcomeText: <p>Learn how to make and manipulate graphs in CODAP.</p>,
	packageName: 'gmri-tutorial',
	version: '0.1',
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
			url: './resources/vs_/vs_MakeGraph.mp4',
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
			key: 'PlotAbundance',
			label: <span>Drag <strong>European Green</strong> or <strong>Asian Shore</strong> to a graph axis</span>,
			url: './resources/vs_/vs_PlotAbundance.mp4',
			operation: 'attributeChange',
			attributeNameArray: ['European Green Crabs in quadrat', 'Asian Shore Crabs in quadrat'],
			feedback: (
				<div>
					<p>Way to go! You now have the distribution of abundances for that crab.</p>
					<p>Now the points have arranged themselves along the axis according to their date.</p>
				</div>
			)
		},
		{
			key: 'RestructureFieldsite',
			label: 'In the table drag "Fieldsite Name" to the left to make a new grouping',
			url: './resources/vs_/vs_TotalInfectionsYAxis.mp4',
			operation: 'createCollection',
			collectionName: 'Fieldsite Names',
			feedback: (
				<div>
					<p>Good job! You\'ve grouped the data by <strong>Fieldsite</strong>.</p>
					<p>Now each <strong>Fieldsite</strong> has its own set of <strong>Teacher</strong>s right next to it.
						This is very useful when you want to compare <strong>Fieldsite</strong>s.</p>
				</div>
			)
		},
		{
			key: 'selectFieldsite',
			label: 'Click on one of the Fieldsite rows in the table',
			url: './resources/vs_/vs_selectFieldsite.mp4',
			operation: 'selectCases',
			collectionName: 'Fieldsite Names',
			feedback: (
				<div>
					<p>You've selected a fieldsite!</p>
					<p>Notice how rows in table to the right are also selected. That's because they all <em>belong</em>
						to the fieldsite you selected.</p>
				</div>
			)
		},
		{
			key: 'Make2ndGraph',
			label: 'Make a second graph that shows the abundance of the other kind of crab',
			url: './resources/vs_/vs_Make2ndGraph.mp4',
			operation: 'attributeChange',
			prereq: 'PlotAbundance',
			attributeNameArray: ['European Green Crabs in quadrat', 'Asian Shore Crabs in quadrat'],
			feedback: (
				<div>
					<p>You now have two graphs, so you can compare the abundances of the
						two kinds of crabs.</p>
					<p>But there's a problem, right? They are difficult to compare unless the axis scales are similar.</p>
				</div>
			)
		},
		{
			key: 'AdjustScales',
			label: 'Adjust the axis scales of the two graphs two make them nearly the same',
			url: './resources/vs_/vs_AdjustScales.mp4',
			operation: 'change axis bounds',
			prereq: 'Make2ndGraph',
			testMethodName: 'twoGraphsWithSimilarScales',
			feedback: (
				<div>
					<p>Good work! That\'s a tricky move!</p>
					<p>With the two scales about the same, you can more easily compare the abundances of the
						two kinds of crabs.</p>
				</div>
			)
		},
		{
			key: 'HideUnselected',
			label: 'Use the graph\'s eyeball menu to hide the unselected cases',
			url: './resources/vs_/vs_HideUnselected.mp4',
			operation: 'hideUnselected',
			prereq: 'selectFieldsite',
			moreThanOneSelected: true,
			feedback: (
				<div>
					<p>That's perfect! Now you can focus in on just the data from the one field site.</p>
					<p>The eyeball menu also lets you show the cases you've hidden.</p>
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
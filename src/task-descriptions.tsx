/**
 * This list of tasks contains descriptions of tasks the user is asked to complete
 **/
import React, {ReactElement} from "react";

export interface TaskDescription {
	key: string,
	label: string,
	url: string,
	feedback: ReactElement,
	alt_feedback?: ReactElement,
	operation?: string,
	type?: string[],
	requiresSpecialHandling?: boolean,
	prereq?: string,
	constraints?: any[]
}

export interface TaskDescriptionsObject {
	descriptions: TaskDescription[],
	getFeedbackFor: (iKey: string, iUseAltFeedback: boolean, iAllAccomplished: boolean) => string,
	taskExists: (iKey: string) => boolean
}

export const taskDescriptions: TaskDescriptionsObject = {
	descriptions: [
		{
			key: 'MakeGraph',
			label: 'Make a graph',
			url: './resources/wx_MakeGraph.mp4',
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
			label: 'Drag the attribute "when" to a graph\'s x-axis',
			url: './resources/wx_WhenXAxis.mp4',
			feedback: (
				<div>
					<p>Way to go! You dragged the <strong>when</strong> attribute to the graph's x-axis.</p>
					<p>Now the points have arranged themselves along the axis according to their date.</p>
				</div>
			)
		},
		{
			key: 'TempYAxis',
			label: 'Drag a temperature attribute to the graph\'s y-axis',
			url: './resources/wx_TempYAxis.mp4',
			feedback: (
				<div>
					<p>Alright! You dragged a temperature attribute to the graph's y-axis.</p>
					<p>Now the points have arranged themselves in a scatterplot.</p>
				</div>
			)
		},
		{
			key: 'SelectCase',
			label: 'Click on a point in the graph or a row in the table',
			url: './resources/wx_SelectCase.mp4',
			feedback: (
				<div>
					<p>You've selected a case.</p>
					<p>When you click on a point it highlights in all graphs displaying that case and the corresponding
						row in the table is selected as well.</p>
					<p>Clicking on a row in a table also selects that case and highlights the corresponding point in
						the graph.</p>
				</div>
			)
		},
		{
			key: 'ConnectingLines',
			label: 'Connect the points on your scatterplot with lines',
			url: './resources/wx_ConnectingLines.mp4',
			operation: 'toggle connecting line',
			feedback: (
				<div>
					<p>Using connecting lines to connect points can make a graph easier to understand,
						especially when the x-axis represents a date or time.</p>
					<p>There are many other things you can do with your graph using the features
						in the Ruler menu.</p>
				</div>
			)
		},
		{
			key: 'changeYAttribute',
			label: 'Drag a new attribute to the graph\'s y-axis',
			url: './resources/wx_changeYAttribute.mp4',
			feedback: (
				<div>
					<p>Way to go! You can change what is plotted just by dragging attributes to axes, even
						if something is already plotted there.</p>
					<p>It works for either axis <em>and</em> for the legend if you have one.</p>
				</div>
			)
		},
		{
			key: 'add2ndAttribute',
			label: 'Drag a second attribute to the graph\'s y-axis',
			operation: 'add axis attribute',
			url: './resources/wx_add2ndAttribute.mp4',
			feedback: (
				<div>
					<p>Good one! Now you can easily compare how the values for the two attributes change over time.</p>
					<p>Having more than two attributes on a graph makes some patterns much easier to discover.</p>
				</div>
			)
		},
		{
			key: 'changeTitle',
			label: 'Change the title of your graph or table',
			url: './resources/wx_changeTitle.mp4',
			operation: 'titleChange',
			feedback: (
				<div>
					<p>Way to go! You changed its name.</p>
					<p>Changing the name of a graph or table can help you keep track of your investigation
						and help others understand what you are trying to do.</p>
				</div>
			)
		}/*,
		{
			key: 'MoveComponent',
			label: 'Move a table or graph',
			url: '',
			operation: 'move',
			type: ['DG.GraphView', 'DG.TableView'],
			feedback: (
				<div>
					<p>You <em>moved</em> that component by clicking and dragging on its title bar!</p>
					<p>You can also <em>resize</em> a component by dragging an edge or lower corner.</p>
				</div>
			)
		},
		{
			key: 'ResizeComponent',
			label: 'Resize a table or graph',
			url: '',
			operation: 'resize',
			type: ['DG.GraphView', 'DG.TableView'],
			feedback: (
				<div>
					<p>You <em>resized</em> that component by clicking and dragging on an edge or corner!</p>
					<p>It's especially important not to make the table so big that it doesn't leave room for graphs and maps</p>
				</div>
			)
		},
		{
			key: 'dragAxis',
			label: 'Drag the scale on a graph axis',
			url: '',
			operation: 'change axis bounds',
			feedback: (
				<div>
					<p>Great! That's a tricky one!</p>
					<p>You can also zoom in by double-clicking on white space inside the graph
						or zoom out by holding down the <em>Shift</em> key while double-clicking.</p>
				</div>
			)
		},
		{
			key: 'rescaleGraph',
			label: 'Click the graph\'s Rescale icon',
			url: '',
			operation: 'rescaleGraph',
			feedback: (
				<div>
					<p>Nice! That's a handy way to make sure all the data are showing in your graph.</p>
					<p>Of course you don't have to do it very often because graph's auto-rescale when an
						axis or legend attribute changes.</p>
				</div>
			)
		}*/
	],
	getFeedbackFor: (iKey: string, iUseAltFeedback?: boolean, iAllAccomplished?: boolean): any => {
		let tDesc = taskDescriptions.descriptions.find(function (iDesc) {
			return iKey === iDesc.key;
		});
		let tFeedback = tDesc ? (iUseAltFeedback ? tDesc.alt_feedback : tDesc.feedback) : '';
		if (iAllAccomplished) {
			tFeedback = allAccomplishedFeedback;
		}
		return tFeedback;
	},
	taskExists: (iKey: string): boolean => {
		return taskDescriptions.descriptions.some(function (iDesc) {
			return iKey === iDesc.key;
		});
	}
}

const allAccomplishedFeedback = (
	<div>
		<p>Congratulations! You've completed all ${taskDescriptions.descriptions.length} tasks.</p>
		<p>You can do a <em>lot</em> in CODAP with just the skills you've practiced!</p>
		<p>Before you quit, spend some more time with this weather data and see what else you
				can discover.</p>
	</div>
)

/*
const infoFeedback = (
	<div>
		<p>This onboarding plugin for CODAP was created to help new CODAP users get started using CODAP.
			It lives in CODAP as an iFrame.
			Certain user actions cause CODAP to notify the plugin. The plugin responds by providing feedback
			to the user.
		</p>
		<p>The open source code is at
			<a
				href={'https://github.com/concord-consortium/codap-data-interactives/tree/master/onboarding'}
				target={'_blank'}
			>CODAP's data interactive GitHub repository</a>.</p>
		<p>This plugin makes use of the CODAP data interactive plugin API whose documentation is at<br/>
			<a
				href={'https://github.com/concord-consortium/codap-data-interactives/tree/master/onboarding'}
				target={'_blank'}
			>CODAP's data interactive GitHub repository</a>.</p>
	</div>
)*/

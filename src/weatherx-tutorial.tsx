// ==========================================================================
//
//  Author:   wfinzer
//
//  Copyright (c) 2021 by The Concord Consortium, Inc. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// ==========================================================================

import React, {Component} from 'react';
import {initializePlugin} from './lib/codap-helper';
import './weatherx-tutorial.css';
import {WelcomeArea} from "./welcome-area";
import {TaskList} from "./task-list";
import {taskDescriptions} from "./task-descriptions";
import codapInterface from "./lib/CodapInterface";
import {ValueResult} from "./tutorial-types";

const kPluginName = "WeatherX Tutorial";
const kVersion = "0.9";
const kInitialDimensions = {
	width: 450,
	height: 495
}

class WeaterxTutorial extends Component<{},
	{
		whichFeedback: string,
		movieURL: string,
		feedbackText: string,
		accomplished: string[]
	}> {

	constructor(props: any) {
		super(props);
		this.state = {
			whichFeedback: 'welcome',
			movieURL: '',
			feedbackText: '',
			accomplished: []
		}
		this.handleHelpClick = this.handleHelpClick.bind(this);
		this.handleCodapNotification = this.handleCodapNotification.bind(this);
		this.handleOtherNotification = this.handleOtherNotification.bind(this);

		codapInterface.on('notify', 'documentChangeNotice', '', this.handleCodapNotification);
		codapInterface.on('notify', 'dataContextChangeNotice', '', this.handleCodapNotification);
		codapInterface.on('notify', 'component', '', this.handleCodapNotification);
		codapInterface.on('notify', '*', '', this.handleOtherNotification);
	}

	public componentDidMount() {
		initializePlugin(kPluginName, kVersion, kInitialDimensions);
	}

	private async handleCodapNotification(iNotification: any) {
		let this_ = this,
				tValues = iNotification.values;

/*
		async function handleAttributeChange() {
			let tChangeResult: any = await codapInterface.sendRequest({
				action: 'get',
				resource: 'componentList'
			});
			if (tChangeResult.success && tChangeResult.values.length > 1) {
				let tGraphRequestList: { action: string, resource: string }[] = [];
				tChangeResult.values.forEach(function (iComponent: { type: string, id: number }) {
					if (iComponent.type === 'graph') {
						tGraphRequestList.push({
							action: 'get',
							resource: 'component[' + iComponent.id + ']'
						})
					}
				});
				if (tGraphRequestList.length > 0) {
					let tGraphResult: any = await codapInterface.sendRequest(tGraphRequestList);
					let maxAttrsFound = 0;
					tGraphResult.forEach(function (iResult: ValueResult) {
						let numAttrsFound = 0;
						['xAttributeName', 'yAttributeName', 'y2AttributeName', 'legendAttributeName'].forEach(
							(iKey) => {
								if (iResult.values[iKey])
									numAttrsFound++;
							}
						);
						maxAttrsFound = Math.max(maxAttrsFound, numAttrsFound);
					});
					switch (maxAttrsFound) {
						case 1:
							if (taskDescriptions.taskExists('AssignAttribute'))
								this_.handleAccomplishment('AssignAttribute');
							break;
						case 2:
							if (taskDescriptions.taskExists('MakeScatterplot'))
								this_.handleAccomplishment('MakeScatterplot');
						// fallthrough deliberate
						case 3:
							this_.handleAccomplishment('SecondAttribute');
							break;
					}
				}
			}
		}
*/

/*
		function handleLegendAttributeChange() {
			if (tValues.type === 'DG.GraphModel' && (tValues.attributeName === 'Sex'))
				this_.handleAccomplishment('MakeLegend');
		}

		async function handleDataContextCountChanged() {
			let tListResult: any = await codapInterface.sendRequest({
				action: 'get',
				resource: 'dataContextList'
			});
			if (tListResult.success && tListResult.values.length > 1) {
				let tName = tListResult.values[0].name;
				await codapInterface.sendRequest({
					action: 'delete',
					resource: 'dataContext[' + tName + ']'
				});
			}
			this_.handleAccomplishment('Drag');
		}
*/

		switch (tValues.operation) {
/*
			case 'dataContextCountChanged':
				await handleDataContextCountChanged();
				break;
*/
			case 'create':
				if (tValues.type === 'graph')
					this.handleAccomplishment('MakeGraph');
				else if (tValues.type === 'table')
					this.handleAccomplishment('MakeTable');
				break;
			case 'move':
				if (tValues.type === 'DG.GraphView' || tValues.type === 'DG.TableView')
					this.handleAccomplishment('MoveComponent');
				break;
			case 'resize':
				if (tValues.type === 'DG.GraphView' || tValues.type === 'DG.TableView')
					this.handleAccomplishment('ResizeComponent');
				break;
			case 'attributeChange':
				if( tValues.attributeName === 'when' && tValues.axisOrientation === 'horizontal')
					this.handleAccomplishment('WhenXAxis');
				else if( tValues.attributeName.startsWith('t') && tValues.axisOrientation === 'vertical' &&
							!this.isAccomplished('TempYAxis'))
					this.handleAccomplishment('TempYAxis');
				else if(tValues.axisOrientation==='vertical' && this.isAccomplished('TempYAxis'))
					this.handleAccomplishment('changeYAttribute');
				break;
			case 'selectCases':
				if( tValues.result.cases)
					this.handleAccomplishment('SelectCase');
				break;
			case 'change axis bounds':
				this.handleAccomplishment('dragAxis');
				break;
			/*
						case 'legendAttributeChange':
							handleLegendAttributeChange();
			*/
		}
		return {success: true};
	}

	handleOtherNotification(iNotification: any) {
		// Is the operation and type in the task descriptions. If so, we can treat it generically
		let tTask = taskDescriptions.descriptions.find((iDescription) => {
			return iDescription.operation === iNotification.values.operation && !iDescription.requiresSpecialHandling &&
				(!iDescription.prereq || this.isAccomplished(iDescription.prereq) &&
					(!iDescription.constraints || iDescription.constraints.some(iConstraint => {
						let isBool = typeof iConstraint.value === 'boolean',
							tNotificationHasResult = Boolean(iNotification.values.result),
							tNotificationValue;
						if (tNotificationHasResult) {
							tNotificationValue = isBool ? Boolean(iNotification.values.result[iConstraint.property]) :
								iNotification.values.result[iConstraint.property];
						} else {
							tNotificationValue = iNotification.values[iConstraint.property];
						}
						return tNotificationValue === iConstraint.value;
					})));
		});
		if (tTask) {
			this.handleAccomplishment(tTask.key);
		}
		return {success: true};
	}

	allAccomplished() {
		let this_ = this;
		return taskDescriptions.descriptions.every(function (iDesc) {
			return this_.state.accomplished.indexOf(iDesc.key) >= 0;
		})
	}

	isAccomplished(iKey: string) {
		return this.state.accomplished.some(function (iAccomplishment) {
			return iAccomplishment === iKey;
		});
	}

	handleAccomplishment(iAccomplishment: string, iQualifier?: boolean) {
		let this_ = this;
		iQualifier = iQualifier || false;
		if (taskDescriptions.taskExists(iAccomplishment) && !this.isAccomplished(iAccomplishment)) {
			this.addAccomplishment(iAccomplishment);
			let tFeedback = taskDescriptions.getFeedbackFor(iAccomplishment, iQualifier, this.allAccomplished());
			if (this.state.whichFeedback === 'feedback') {
				this.setState({
					feedbackText: '',
					whichFeedback: ''
				});
				setTimeout(function () {
					this_.setState({
						feedbackText: tFeedback,
						whichFeedback: 'feedback'
					});
				}.bind(this), 0);
			} else {
				this.setState({
					feedbackText: tFeedback,
					whichFeedback: 'feedback'
				});
			}
		}
	};

	addAccomplishment(iKey: string) {
		let accomplished = this.state.accomplished.slice(),
			index = accomplished.indexOf(iKey);
		if (index < 0)
			accomplished.push(iKey);
		this.setState({accomplished: accomplished})
	}

	private handleHelpClick(movieURL:string) {
		let this_ = this;
		this.setState({movieURL: '', whichFeedback: ''});
		setTimeout(function () {
			this_.setState({movieURL: movieURL, whichFeedback: 'movie'});
		}, 10);
		codapInterface.sendRequest({
			action: 'notify',
			resource: 'logMessage',
			values: {
				formatStr: "User clicked ShowMe for %@",
				replaceArgs: [movieURL]
			}
		});
	}

	public render() {
		let tHelp = this.state.whichFeedback === '' ? '' :
			<WelcomeArea
				movieURL={this.state.movieURL}
				feedbackText={this.state.feedbackText}
				whichFeedback={this.state.whichFeedback}
				handleEnded={() => 'ended'}
			/>;
		let taskList =
			<TaskList
				descriptions={taskDescriptions.descriptions}
				accomplished={this.state.accomplished}
				handleHelpClick={this.handleHelpClick}
			/>;

		return (
			<div className="WeatherxTutorial">
				{tHelp}
				<p className="WeatherxTutorial-intro">
					Figure out how to accomplish each of these basic CODAP tasks:
				</p>
				<div className="WeatherxTutorial-taskarea">
					{taskList}
				</div>
			</div>
		);
	}

}

export default WeaterxTutorial;

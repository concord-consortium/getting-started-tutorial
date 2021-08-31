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
import './getting-started-tutorial.css';
import {WelcomeArea} from "./welcome-area";
import {TaskList} from "./task-list";
import {TaskDescription} from "./task-types";
import {taskDescriptions, allAccomplishedFeedback, parameters} from "./wx-constants";
import codapInterface from "./lib/CodapInterface";

class GettingStartedTutorial extends Component<{},
	{
		whichFeedback: string,
		movieURL: string,
		feedbackText: any,
		provisionallyAccomplished: string[],
		accomplished: string[]
	}> {

	constructor(props: any) {
		super(props);
		this.state = {
			whichFeedback: 'welcome',
			movieURL: '',
			feedbackText: '',
			provisionallyAccomplished: [],
			accomplished: []
		}
		this.handleHelpClick = this.handleHelpClick.bind(this);
		this.checkForTaskCompletion = this.checkForTaskCompletion.bind(this);
		codapInterface.on('notify', '*', '', this.checkForTaskCompletion);
	}

	public componentDidMount() {
		initializePlugin(parameters.name, parameters.version, parameters.initialDimensions);
	}

	private async checkForTaskCompletion( iNotification: any) {
		let this_ = this,
			tHandledOne = false,
			tValues = iNotification.values,
			tCandidates = taskDescriptions.descriptions.filter(iDesc=>{
			return iDesc.operation === tValues.operation;
		});
		await tCandidates.forEach(async iCandidate=>{
			if( !this_.isAccomplished(iCandidate.key) &&
				(!iCandidate.componentTypeArray || iCandidate.componentTypeArray.includes(tValues.type)) &&
				(!iCandidate.attributeNameArray || iCandidate.attributeNameArray.includes(tValues.attributeName)) &&
				(!iCandidate.axisOrientation || iCandidate.axisOrientation === tValues.axisOrientation) &&
				(!iCandidate.prereq || this_.isAccomplished(iCandidate.prereq)) &&
				(!iCandidate.renameType || await this_.resourceIsOfType(iNotification.resource, iCandidate.renameType)) &&
				(!iCandidate.collectionName || (tValues.result.cases && tValues.result.cases.length > 0 &&
					tValues.result.cases[0].collection.name === iCandidate.collectionName)) &&
				(!iCandidate.noneSelected || !tValues.result.cases) &&
				(!iCandidate.moreThanOneSelected || (tValues.result.cases && tValues.result.cases.length > 1))
			) {
				this_.handleAccomplishment( iCandidate.key);
				this_.acceptProvisionals();
				tHandledOne = true;
			}
		});
		if( !tHandledOne && this.allAccomplished()) {
			this.setState({
				whichFeedback: 'feedback',
				feedbackText: allAccomplishedFeedback
			})
		}

	}

	private async resourceIsOfType(iResource:string, iType:string):Promise<boolean> {
		let tResult = false,
			tMatch = iResource.match(/\d+/),
			tID = tMatch && Number(tMatch[0]);
		if( tID) {
			let tGetResult:any = await codapInterface.sendRequest( {
				action: 'get',
				resource: `component[${tID}]`
			});
			tResult = tGetResult.success && tGetResult.values.type === iType;
		}
		return tResult;
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
			this.addAccomplishmentProvisionally(iAccomplishment);
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
	}

	acceptProvisionals() {
		let accomplished = this.state.accomplished.slice();
		this.state.provisionallyAccomplished.forEach( iKey => {
			if( !accomplished.includes(iKey))
				accomplished.push(iKey);
		});
		this.setState({accomplished: accomplished, provisionallyAccomplished: []});
	}

	addAccomplishmentProvisionally(iKey: string) {
		let provisionallyAccomplished = this.state.provisionallyAccomplished.slice(),
			index = provisionallyAccomplished.indexOf(iKey);
		if (index < 0)
			provisionallyAccomplished.push(iKey);
		this.setState({provisionallyAccomplished: provisionallyAccomplished})
	}

	private handleHelpClick(movieURL: string) {
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
			<div className="GettingStartedTutorial">
				{tHelp}
				<div className="GettingStartedTutorial-intro">
					{parameters.intro1}
					{parameters.intro2}
					<div className="GettingStartedTutorial-taskarea">
						{taskList}
					</div>
				</div>
			</div>
		);
	}

}

export default GettingStartedTutorial;

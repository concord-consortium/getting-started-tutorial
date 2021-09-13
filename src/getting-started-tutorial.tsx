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
import {allAccomplishedFeedback, parameters, taskDescriptions} from "./wx-constants";
import codapInterface from "./lib/CodapInterface";

class GettingStartedTutorial extends Component<{},
	{
		whichFeedback: string,
		movieURL: string,
		feedbackText: any,
		provisionallyAccomplished: string[],
		accomplished: string[]
	}> {
	[key:string]:any

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

	/**
	 * This method is used by the GMRI tutorial (vs).
	 * @private
	 */
	private twoGraphsWithSimilarScales() {

		function getBounds(iGraph:any) {
			if(iGraph.values.xLowerBound != null)
				return {lower: iGraph.values.xLowerBound, upper: iGraph.values.xUpperBound};
			else if(iGraph.values.yLowerBound != null)
				return {lower: iGraph.values.yLowerBound, upper: iGraph.values.yUpperBound};
			else
				return null;
		}

		function within10Percent(b1:any, b2:any) {

			function inRange(n1:number, n2:number, gap:number) {
				return n1 > n2 - gap && n1 < n2 + gap;
			}

			if( b1===null || b2 === null)
				return false;

			let r1 = b1.upper - b1.lower,
				r2 = b2.upper - b2.lower,
				margin = r1>r2 ? 0.1 * r1 : 0.1 * r2,
				result = inRange( b1.lower, b2.lower, margin) && inRange( b1.upper, b2.upper, margin);
			console.log(b1, b2, result);
			return result;
		}

		let tResult = false,
			tGraphList:any[];
		return codapInterface.sendRequest({
			action: 'get',
			resource:'componentList'
		}).then( (iListResponse:any):Promise<boolean>=>{
				tGraphList = iListResponse.values.filter((iResponse: { type:string })=>{
					return iResponse.type === 'graph';
				});
				if( tGraphList.length > 1) {
					let tGraphsRequests = tGraphList.map(iGraph => {
						return {
							action: 'get',
							resource: `component[${iGraph.id}]`
						}
					});
					return codapInterface.sendRequest(tGraphsRequests).then((iGraphsResults: any) => {
						let tBoundsList = iGraphsResults.map((iGraph: any) => {
							return getBounds(iGraph);
						});
						while (tBoundsList.length > 1 && !tResult) {
							let tOneBounds = tBoundsList.pop();
							tResult = tBoundsList.some((iBounds: any) => {
								return within10Percent(tOneBounds, iBounds);
							})
						}
						return Promise.resolve(tResult);
					});
				}
				return Promise.resolve(false);
			});
	}

	private async checkForTaskCompletion( iNotification: any) {

		function makeKeyedTest(iTest:any, key:string): {test:any, key:string} {
			return {test: iTest, key: key };
		}

		let this_ = this,
			tValues = iNotification.values,
			tCandidates = taskDescriptions.descriptions.filter(iDesc=>{
			return iDesc.operation === tValues.operation;
		});

		let tests = [
			makeKeyedTest((iCandidate:{key:string})=>!this_.isAccomplished(iCandidate.key), 'isAccomplished'),
			makeKeyedTest((iCandidate: { componentTypeArray: string[] }) => {
				return !iCandidate.componentTypeArray ||
					iCandidate.componentTypeArray.includes(tValues.type)
			}, 'componentTypeArray'),
			makeKeyedTest((iCandidate:{attributeNameArray:string[]})=>!iCandidate.attributeNameArray ||
				iCandidate.attributeNameArray.includes(tValues.attributeName), 'attributeNameArray'),
			makeKeyedTest((iCandidate:{axisOrientation:string})=>!iCandidate.axisOrientation ||
				iCandidate.axisOrientation=== tValues.axisOrientation, 'axisOrientation'),
			makeKeyedTest((iCandidate:{prereq:string})=>!iCandidate.prereq ||
				this_.isAccomplished(iCandidate.prereq), 'prereq'),
			makeKeyedTest(async (iCandidate:{renameType:string})=>!iCandidate.renameType ||
				this_.resourceIsOfType(iNotification.resource, iCandidate.renameType), 'renameType'),
			makeKeyedTest((iCandidate:{collectionName:string, operation:string})=>
				!(iCandidate.collectionName && iCandidate.operation === 'selectCases') ||
				(tValues.result.cases && tValues.result.cases.length > 0 &&
					tValues.result.cases[0].collection.name === iCandidate.collectionName), 'collectionName+selectCases'),
			makeKeyedTest((iCandidate:{noneSelected:boolean})=>!iCandidate.noneSelected || !tValues.result.cases,
				'noneSelected'),
			makeKeyedTest((iCandidate:{moreThanOneSelected:boolean})=>!iCandidate.moreThanOneSelected ||
				(tValues.result.cases && tValues.result.cases.length > 1), 'moreThanOneSelected'),
			makeKeyedTest((iCandidate:{somethingHidden:boolean})=>!iCandidate.somethingHidden ||
				(tValues.numberHidden > 0), 'somethingHidden'),
			makeKeyedTest(async (iCandidate:{testMethodName:string})=> {
				return !iCandidate.testMethodName ? Promise.resolve(true) : this_[iCandidate.testMethodName]();
			}, 'testMethodName'),
			makeKeyedTest((iCandidate:{collectionName:string, operation:string})=>
				!(iCandidate.collectionName && iCandidate.operation === 'createCollection') ||
				(tValues.result.name === iCandidate.collectionName), 'collectionName+createCollection')
		];
		function defer(candidate:any, keyedTest:{test:any, key:string}) {
			return function() {
						let testResult = keyedTest.test(candidate);
						const msg = `candidateKey: ${candidate.key}, testKey: ${keyedTest.key}`;
						console.log('testResult = ', testResult, msg);
						return testResult;
/*
						if (testResult)
							return Promise.resolve(`success ${msg}`)
						else
							return Promise.reject(`reject ${msg}`)
*/
					}
			}

		tCandidates.forEach(iCandidate=>{
			let runnableTests = tests.map(iTest=>{
				return defer(iCandidate, iTest);
			});
			let promises = runnableTests.map(iFunc=> {
				return iFunc();
			});

			Promise.all(promises).then(results => {
				if( results.every(iResult=>Boolean(iResult))) {
					this_.handleAccomplishment(iCandidate.key);
					this_.acceptProvisionals();
				}
				else if (this_.allAccomplished()) {
					this.setState({
						whichFeedback: 'feedback',
						feedbackText: allAccomplishedFeedback
					})
				}
			});
		});
	}

	private resourceIsOfType(iResource:string, iType:string):Promise<boolean> {
		let tMatch = iResource.match(/\d+/),
			tID = tMatch && Number(tMatch[0]);
		if( tID) {
			return codapInterface.sendRequest( {
				action: 'get',
				resource: `component[${tID}]`
			}).then((iResult:any)=>{
				return Promise.resolve(iResult.success && iResult.values.type === iType);
			});
		}
		return Promise.resolve(true);
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

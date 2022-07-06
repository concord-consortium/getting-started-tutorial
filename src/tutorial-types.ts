/**
 * Contains interfaces used widely
 */

export interface ValueResult {
	[index:string]:any
}

export interface RequestResult {
	success:boolean,
	results:{values:ValueResult}[]
}
import codapInterface from "./CodapInterface";

export function initializePlugin(pluginName: string, version: string, dimensions: {width: number, height: number}) {
  console.log('In initializePlugin')
  const interfaceConfig = {
    name: pluginName,
    version: version,
    dimensions: dimensions
  };
  const tResult = codapInterface.init(interfaceConfig);
  console.log('Finishing initializePlugin with ', tResult)
}

const dataSetString = (contextName: string) => `dataContext[${contextName}]`;


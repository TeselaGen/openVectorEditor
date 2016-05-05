export const userDefinedTypes = ['parts', 'features', 'translations', 'primers']

export const userDefinedTypesMap = userDefinedTypes.reduce(function (nextVal, key) {
	nextVal[key] = key
	return nextVal
	//  looks like this:
	//{
	// 	parts: 'parts',
	// 	features: 'features',
	// 	translations: 'translations',
	// 	primers: 'primers',
	// }
}, {})


export const derivedDataTypes = ['cutsites']
export const derivedDataTypesMap = derivedDataTypes.reduce(function (nextVal, key) {
	nextVal[key] = key
}, {})
export function getSingular(type) {
	return type.slice(0, -1);
}
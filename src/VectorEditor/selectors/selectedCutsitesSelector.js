import {createSelector} from 'reselect'
import selectedAnnotationsSelector from './selectedAnnotationsSelector'

export default createSelector(selectedAnnotationsSelector, function (selectedAnnotations) {
	var {idStack, idMap} = selectedAnnotations
	var cutsiteIdMap = {}
	var cutsiteIdStack = idStack.filter(function (id) {
      if (idMap[id].annotationType === 'cutsite') {
	      cutsiteIdMap[id] = idMap[id]
	      return true
      }
    })
	return {
		idStack: cutsiteIdStack,
		idMap: cutsiteIdMap
	}
})

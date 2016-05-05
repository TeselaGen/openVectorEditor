import lruMemoize from 'lru-memoize';
import bsonObjectid from 'bson-objectid';
import flatmap from 'lodash.flatmap';
import getCutsitesFromSequence from 've-sequence-utils/getCutsitesFromSequence';
// import enzymeList from 've-sequence-utils/enzymeList';
// import enzymeList from '../../../enzymeList';
// import enzymeList from '../enzymeList.json';
// import enzymeList from '../../../../takaraEnzymeList.json';
import randomcolor from 'randomcolor';
// Object.keys(enzymeList).forEach(function(key){
//   var enzyme = enzymeList[key]
//   // Returns a dark RGB color with random alpha 
//   enzyme.color = randomcolor({
//      luminosity: 'dark',
//      // format: 'rgba' // e.g. 'rgba(9, 1, 107, 0.6482447960879654)' 
//   });
// })
// console.log('enzymeList: ' + JSON.stringify(enzymeList,null,4));

// import sequenceSelector from './sequenceSelector';
// import circularSelector from './circularSelector';
// import {createSelector} from 'reselect';

function cutsitesSelector(sequence, circular, enzymeList) {
  //console.log('GETTING CUTSITES!!!!!');
  //get the cutsites grouped by enzyme
  var cutsitesByName = getCutsitesFromSequence(sequence, circular, Object.keys(enzymeList).map(function(enzymeName) {
      return enzymeList[enzymeName]
    }))
    //tag each cutsite with a unique id
  var cutsitesById = {}
  Object.keys(cutsitesByName).forEach(function(enzymeName) {
    var cutsitesForEnzyme = cutsitesByName[enzymeName]
    cutsitesForEnzyme.forEach(function(cutsite) {
      var uniqueId = bsonObjectid().str
      cutsite.id = uniqueId
      cutsite.annotationType = 'cutsite'
      cutsitesById[uniqueId] = cutsite
    });
  });
  // create an array of the cutsites
  var cutsitesArray = flatmap(cutsitesByName, function(cutsitesForEnzyme) {
    return cutsitesForEnzyme
  });
  return {
    cutsitesByName,
    cutsitesById,
    cutsitesArray
  }

}

export default lruMemoize(5, undefined, true)(cutsitesSelector)
// tnrtodo: figure out where to insert this validation exactly..
var assign = require('lodash/object/assign');
module.exports = function validateAndTidyUpSequenceData(sequenceData) {
  var sequenceData = assign({},sequenceData); //sequenceData is usually immutable, so we clone it and return it
  if (!sequenceData) {
  	console.log('no sequenceData at all...!');
  	sequenceData = {};
  }
  if (!sequenceData.sequence) {
  	console.log('no bps!');
  	sequenceData.sequence = "";
  }
  if (!Array.isArray(sequenceData.features)) {
  	console.log('no features array!');
  	sequenceData.features = [];
  }
  if (!Array.isArray(sequenceData.parts)) {
  	console.log('no parts array!');
  	sequenceData.parts = [];
  }
  return sequenceData;
};

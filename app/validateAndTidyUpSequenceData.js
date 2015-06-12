// tnrtodo: figure out where to insert this validation exactly..
module.exports = function validateAndTidyUpSequenceData(sequenceData) {
  if (!sequenceData) {
  	console.log('no sequenceData at all...!');
  	sequenceData = {};
  }
  if (!sequenceData.sequence) {
  	console.log('no bps, not even an empty string!');
  	sequenceData.sequence = "";
  }
  if (!sequenceData.features) {
  	console.log('no features array!');
  	sequenceData.features = [];
  }
  if (!sequenceData.parts) {
  	console.log('no parts array!');
  	sequenceData.parts = [];
  }
  return sequenceData;
};
var tree = require('../../app/baobabTree.js');
var validateAndTidyUpSequenceData = require('../../app/validateAndTidyUpSequenceData.js');

var simpleSequenceData = {sequence: 'atgc'};
tree.set(['sequenceData'], validateAndTidyUpSequenceData(simpleSequenceData));
module.exports = tree;

// module.exports = function (argument) {
//   return tree;
// };
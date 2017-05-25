// was using this for opening sequence file but it doesn't seem suited to that
// so I moved that to new action overwriteSequenceData

var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var setSelectionLayer = require('./setSelectionLayer');

function insertSequenceData({input, state, output}) {
    var { newSequenceData } = input;
    var { sequenceData, caretPosition } = state.get();

    state.set('sequenceData', assign({},
                                        sequenceData,
                                        insertSequenceDataAtPosition(newSequenceData,
                                                                     sequenceData,
                                                                     caretPosition)));
    state.set('caretPosition', newSequenceData.sequence.length + caretPosition);
}

export default insertSequenceData;

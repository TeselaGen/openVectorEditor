var assign = require('lodash/object/assign');
var insertSequenceDataAtPosition = require('ve-sequence-utils/insertSequenceDataAtPosition');
var setSelectionLayer = require('./setSelectionLayer');

function insertSequenceData({input, state, output}) {
    console.log("got into insert")
    // var { newSequenceData } = input;
    // console.log("input passed to insert is ");
    // console.log(newSequenceData);
    // var { sequenceData, caretPosition } = state.get();

    // state.set('sequenceData', assign({}, 
    //                                     sequenceData, 
    //                                     insertSequenceDataAtPosition(newSequenceData, 
    //                                                                  sequenceData, 
    //                                                                  caretPosition)));
    // state.set('caretPosition', newSequenceData.sequence.length + caretPosition);
}

export default insertSequenceData;
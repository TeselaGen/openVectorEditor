module.exports = function(a) {
    return ([
        a.getData('selectionLayer', 'sequenceLength', 'bpsPerRow', 'caretPosition'),
        a.checkShiftHeld, {
            shiftHeld: [a.checkLayerIsSelected, {
                selected: [a.updateSelectionShiftClick, a.setSelectionLayer],
                notSelected: [a.createSelectionShiftClick, {
                    updateSelection: [a.setSelectionLayer],
                    doNothing: []
                }]
            }],
            shiftNotHeld: [a.updateOutput('annotation', 'selectionLayer'), a.setSelectionLayer]
        }
    ])
}
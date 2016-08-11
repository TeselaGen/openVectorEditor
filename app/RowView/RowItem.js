import React, {PropTypes} from 'react';
// import HighlightLayer from './HighlightLayer';

var getComplementSequenceString = require('ve-sequence-utils/getComplementSequenceString');
var SequenceContainer = require('./SequenceContainer');
// var AxisContainer = require('../AxisContainer');
// var OrfContainer = require('../OrfContainer');
// var TranslationContainer = require('../TranslationContainer');
// var FeatureContainer = require('../FeatureContainer');
// var CutsiteLabelContainer = require('./CutsiteLabelContainer');
// var CutsiteSnipsContainer = require('./CutsiteSnipsContainer');
// var Caret = require('./Caret');

class RowItem extends React.Component {
    render() {
        var {
            charWidth,
            selectionLayer,
            searchLayers,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            spaceBetweenAnnotations,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            row,
            uppercase,
            signals,
        } = this.props;

        if (!row) {
            return null;
        }
        var fontSize = charWidth + "px";
        
        var rowContainerStyle = {
            overflow: "hidden",
            position: "relative",
            width: "100%",
        };

        var sequence = (uppercase) ? row.sequence.toUpperCase() : row.sequence.toLowerCase();

        return (
            <div className="rowContainer"
                style={rowContainerStyle}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onMouseDown={this.onMouseDown}
                >
               


                <SequenceContainer 
                    sequence={sequence} 
                    charWidth={charWidth}>

                </SequenceContainer>

                {showReverseSequence &&
                    <SequenceContainer sequence={ getComplementSequenceString(sequence)} charWidth={charWidth}>

                    </SequenceContainer>
                }





            </div>
        );
    }
}

module.exports = RowItem;

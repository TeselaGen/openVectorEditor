import React, { PropTypes } from 'react';
import colorOfAminoAcid from '../../constants/amino-acid-colors';

let getAminoAcidFromSequenceTriplet = require('ve-sequence-utils/getAminoAcidFromSequenceTriplet');

let AminoAcids = React.createClass({

    handleClick: function(event) {
        event.stopPropagation();
        var id = parseInt(event.currentTarget.id) - 2;
        let start = this.props.row.start + id;
        let end = this.props.row.start + id + 2;

        if (start < 0) {
            start = this.props.sequenceData.sequence.length + start;
        }
        if (end >= this.props.sequenceData.sequence.length) {
            end -= this.props.sequenceData.sequence.length;
        }

        var selection = {
            start: start,
            end: end,
            id: null,
            selected: true,
            cursorAtEnd: true
        }
        this.props.signals.setSelectionLayer({ selectionLayer: selection })
    },

    render: function() {
        var {
            bpsPerRow,
            charWidth,
            sequence,
            sequenceData,
            rowNumber,
            topStrand,
        } = this.props;

        if (sequence.length < 3) {
            return null;
        }

        let viewBoxWidth = bpsPerRow * charWidth * 1.2 + 40; // 1.2 & 40 for padding
        let rowWidth = bpsPerRow * (charWidth-1) * 1.2;
        let actualWidth = (rowWidth * (bpsPerRow * (charWidth - 1))) / viewBoxWidth;
        var letterSpacing = ((actualWidth - 10) - 11.2*bpsPerRow) / (bpsPerRow - 1); // this 11.2 is default letterSpacing

        var rows = [[],[],[]];
        var aminoAcid;
        var color;
        var path;
        var xShift;
        var width;
        var height = 20;

        // the first and last row need adjusting if the part isn't circular
        // (default behavior is for a circular part)
        var i = 0;
        var sequenceLength = sequence.length;
        if (rowNumber === 0 && !sequenceData.circular) {
            i = 2;
        }
        let lastRow = Math.floor((sequenceData.sequence.length-1) / bpsPerRow);
        if (rowNumber === lastRow && !sequenceData.circular) {
            sequenceLength -= 2;
        }

        for ( i; i<sequenceLength-2; i++) {
            if (sequence[i] && sequence[i+2]) {
                if (topStrand) {
                    aminoAcid = getAminoAcidFromSequenceTriplet(sequence.slice(i,i+3));
                } else {
                    aminoAcid = getAminoAcidFromSequenceTriplet(sequence[i+2]+sequence[i+1]+sequence[i]);
                }
                color = colorOfAminoAcid(aminoAcid.value.toUpperCase());
                xShift = (letterSpacing + 11.2) * (i - 2) - 2.5;

                // amino acids that wrap around rows need adjustments
                if (i === sequence.length - 3 || i === 0) {
                    width = (letterSpacing+11.2) - 5;
                } else if (i === sequence.length - 4 || i === 1) {
                    width = (letterSpacing+11.2)*2 - 5;
                } else {
                    width = (letterSpacing+11.2)*3 - 5;
                }
                if (i === 0 || i === 1) {
                    xShift = -2.5;
                }

                path = `
                    M ${xShift},0
                    L ${width + xShift},0
                    L ${width + xShift},${height}
                    L ${xShift},${height}
                    z`;

                rows[i%3].push(
                    <g
                        key={"amino" + i}
                        id={i}
                        onClick={this.handleClick}>
                        <path
                            style={{opacity:'0.5'}}
                            fill={ color }
                            transform={null}
                            d={ path }
                            />
                        <text
                            fill="black"
                            y="13"
                            x={xShift + (width - letterSpacing)/2}
                            >
                            { aminoAcid.value }
                        </text>
                    </g>
                );
            }
        }

        var style = {
            position: 'relative',
            fontFamily: 'monospace',
            padding: '10px 25px 10px 25px',
            overflow: 'visible',
            letterSpacing: letterSpacing + 'px',
            fontSize: '10pt',
            height: '20px',
            width: '100%'
        }
        var padding = topStrand ? {marginBottom: '10px'} : {marginTop: '-5px'};
        return (
            <div className="aminoAcidContainer" style={padding}>
                <svg style={style}>
                    { topStrand ? rows[1] : rows[2] }
                </svg>
                <svg style={style}>
                    { rows[0] }
                </svg>
                <svg style={style}>
                    { topStrand ? rows[2] : rows[1] }
                </svg>
            </div>
        );
    }
});

module.exports = AminoAcids;

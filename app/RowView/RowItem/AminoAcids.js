import React, { PropTypes } from 'react';
let getAminoAcidFromSequenceTriplet = require('ve-sequence-utils/getAminoAcidFromSequenceTriplet');

let AminoAcids = React.createClass({

    handleClick: function(event) {
        event.stopPropagation();
        var id = parseInt(event.currentTarget.id);
        var selection = {
            start: this.props.row.start + id,
            end: this.props.row.start + id + 2,
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
        var path;
        var xShift;
        var width = (letterSpacing+11.2)*3 - 10;
        var height = 20;

        for (var i = 0; i<sequence.length-2; i++) {
            if (sequence[i] && sequence[i+2]) {
                aminoAcid = getAminoAcidFromSequenceTriplet(sequence.slice(i,i+3));
                xShift = (letterSpacing+11.2)*i;
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
                        style={{border:'1px black solid'}}
                        onClick={this.handleClick}>
                        <path
                            style={{opacity:'0.25'}}
                            fill={ aminoAcid.color }
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

        return (
            <div className="aminoAcidContainer" style={{paddingBottom:'5px'}}>
                <svg style={style}>
                    { rows[2] }
                </svg>
                <svg style={style}>
                    { rows[1] }
                </svg>
                <svg style={style}>
                    { rows[0] }
                </svg>
            </div>
        );
    }
});

module.exports = AminoAcids;

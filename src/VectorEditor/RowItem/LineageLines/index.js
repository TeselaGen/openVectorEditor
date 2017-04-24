import classnames from 'classnames';
import AnnotationPositioner from '../AnnotationPositioner'
import AnnotationContainerHolder from '../AnnotationContainerHolder'
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './style.scss';

var getXStartAndWidthOfRangeWrtRow = require('../getXStartAndWidthOfRangeWrtRow');
let getOverlapsOfPotentiallyCircularRanges = require('ve-range-utils/getOverlapsOfPotentiallyCircularRanges');

function mixin(target, source) {
    target = target.prototype;

    Object.getOwnPropertyNames(source).forEach((name) => {
        let sourceProp = Object.getOwnPropertyDescriptor(source, name);

        if (name !== "constructor") {
            Object.defineProperty(target, name, sourceProp);
        }
    });
}

export default class LineageLines extends React.Component {
    render() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            lineageLines=[],
            lineageLineHeight=6
        } = this.props;

        var lineageLinesToUse = lineageLines
        if (!Array.isArray(lineageLines)) {
          lineageLinesToUse = [lineageLines]
        }
        return <AnnotationContainerHolder
            className='veRowViewLineageLines'
            containerHeight={lineageLineHeight}>
            {lineageLinesToUse.sort(function (lineageLine) {
              return lineageLine.inBetweenBps ? 1 : 0
            }).map(function (lineageLine, index) {
              var rangeSpansSequence = lineageLine.start === lineageLine.end + 1 || (lineageLine.start === 0 && lineageLine.end === sequenceLength-1)
              var {className='', style={}, color } = lineageLine
              var overlaps = getOverlapsOfPotentiallyCircularRanges(lineageLine, row, sequenceLength);
              return overlaps.map(function (overlap,index2) {
                var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);
                var lineageStart = overlap.start === lineageLine.start
                var lineageEnd = overlap.end === lineageLine.end

                return [<AnnotationPositioner
                    height={lineageLineHeight}
                    width={width}
                    key={index}
                    top= {0}
                    // className={classnames() } 
                    left={(xStart + (lineageLine.inBetweenBps ? charWidth/1.2 : 0))}
                    >
                    <g>
                        <rect fill={color} x="0" y="0" height={lineageLineHeight} width={width}/>
                        {rangeSpansSequence && lineageStart && <rect fill={'#408CE1'} x="0" y="0" height={lineageLineHeight} width={4}/>}
                        {rangeSpansSequence && lineageEnd && <rect fill={'#408CE1'} x={width-4} y="0" height={lineageLineHeight} width={4}/>}
                    </g>
                  </AnnotationPositioner>]
              })
            })}
        </AnnotationContainerHolder>
    }
}

mixin(LineageLines, PureRenderMixin);

module.exports = LineageLines;

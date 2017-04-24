import draggableClassnames from '../../constants/draggableClassnames';
import React, {PropTypes} from 'react';
import Caret from '../Caret';
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

export default class SelectionLayer extends React.Component {
    render() {
        var {
            charWidth,
            bpsPerRow,
            row,
            sequenceLength,
            regions,
            hideCarets=false,
            selectionLayerRightClicked,
            className: globalClassname=''
        } = this.props;
        return <div>
          {regions.map(function (selectionLayer, index) {
            var {className='', style={}, start, end, color } = selectionLayer
            var classNameToPass = 'veRowViewSelectionLayer ' + className + ' ' + className + ' ' + globalClassname
            if (start > -1) {
              var overlaps = getOverlapsOfPotentiallyCircularRanges(selectionLayer, row, sequenceLength);
              //DRAW SELECTION LAYER

              return (overlaps.map(function(overlap, index) {
                var isTrueStart = false
                var isTrueEnd = false
                if (overlap.start === selectionLayer.start) {
                  isTrueStart = true
                }
                if (overlap.end === selectionLayer.end) {
                  isTrueEnd = true
                }
                var {xStart, width} = getXStartAndWidthOfRangeWrtRow(overlap, row, bpsPerRow, charWidth, sequenceLength);
                var caretSvgs = []
                if (!hideCarets) {
                  //DRAW CARETS
                  caretSvgs = [
                    (overlap.start === start) && <Caret {...{
                      charWidth,
                      row,
                      sequenceLength,
                      className: classNameToPass + ' ' + draggableClassnames.selectionStart,
                      caretPosition: overlap.start
                    }}
                    />, 
                  (overlap.end === end) && <Caret {...{
                    charWidth,
                    row,
                    sequenceLength,
                    className: classNameToPass + ' ' + draggableClassnames.selectionEnd,
                    caretPosition: overlap.end + 1
                  }}
                  />
              ]
            }
            return [
              <div 
                onContextMenu={function (event) {
                  selectionLayerRightClicked({event,annotation: selectionLayer})
                }}
                key={index} 
                className={classNameToPass + (isTrueStart ? ' isTrueStart ' : '') + (isTrueEnd ? ' isTrueEnd ' : '') } 
                style={{
                  width,
                  left: xStart,
                  ...style,
                  background: color
                }}
                />,
              ...caretSvgs
            ]
          }))
          }
        })}
        </div>
    }
}

mixin(SelectionLayer, PureRenderMixin);

module.exports = SelectionLayer;

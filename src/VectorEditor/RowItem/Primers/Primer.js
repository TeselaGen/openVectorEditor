import getAnnotationNameAndStartStopString from '../../utils/getAnnotationNameAndStartStopString'

var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var Primer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        widthInBps: React.PropTypes.number.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        rangeType: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        forward: React.PropTypes.bool.isRequired,
        primerClicked: React.PropTypes.func.isRequired,
    },

    render: function() {
        var {
            widthInBps, 
            charWidth, 
            height, 
            rangeType, 
            forward, 
            name,
            pointiness=8,
            fontWidth=9, 
            color='orange', 
            primerClicked,
            primerRightClicked,
            annotation
        } = this.props;

        var width = widthInBps * charWidth;
        var charWN = charWidth; //charWN is normalized
        if (charWidth < 15) { //allow the arrow width to adapt
            if (width > 15) {
                charWN = 15; //tnr: replace 15 here with a non-hardcoded number..
            } else {
                charWN = width;
            }
        }
        var widthMinusOne = width - charWN;
        var path;
        // starting from the top left of the primer
        if (rangeType === 'middle') {
            //draw a rectangle
            path = `
            M 0,0 
            L ${width-pointiness/2},0
            Q ${width + pointiness/2},${height/2} ${width-pointiness/2},${height}
            L ${0},${height}
            Q ${pointiness},${height/2} ${0},${0}
            z`;
        } else if (rangeType === 'start') {
            path = `
            M 0,0 
            L ${width-pointiness/2},0 
            Q ${width + pointiness/2},${height/2} ${width-pointiness/2},${height}
            L 0,${height} 
            z`
        } else if (rangeType ==='beginningAndEnd') {
            path = `
            M 0,0 
            L ${widthMinusOne},0 
            L ${width},${height/2} 
            L ${widthMinusOne},${height} 
            L 0,${height} 
            z`
        } else {
          path = `
          M 0,0 
          L ${widthMinusOne},0 
          L ${width},${height/2} 
          L ${widthMinusOne},${height} 
          L 0,${height} 
          Q ${pointiness},${height/2} ${0},${0}
          z`
        }

        function getTextWidth(text, font) {
            // re-use canvas object for better performance
            var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
            var context = canvas.getContext("2d");
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        }
        var textLength = getTextWidth(name, 'normal 10pt Maven Pro')
        var nameToDisplay = name
        // var textLength = name.length * fontWidth
        var textOffset = (rangeType === 'end' && !forward) ? 14 : 6
        if ((textLength - 30 > widthMinusOne) ) {
          textOffset = 0
          nameToDisplay = ''
        }
        // path=path.replace(/ /g,'')
        // path=path.replace(/\n/g,'')
        return (
            <g
                className='veRowViewPrimer clickable'
                onClick={function (event) {
                  primerClicked({annotation,event})
                }}
                onContextMenu={function (event) {
                  primerRightClicked({annotation,event})
                }}
                >
                <title>{getAnnotationNameAndStartStopString(annotation)}</title>
                <path
                  strokeWidth="1"
                  stroke={ 'black' }
                  fill={ color }
                  transform={ forward ? null : "translate(" + width + ",0) scale(-1,1) " }
                  d={ path }/>
                <text style={{fill: 'black', fontSize: '10px'}} transform={`translate(${textOffset},${height-2})`}>{nameToDisplay}</text>
            </g>
            );
    }
});
module.exports = Primer;

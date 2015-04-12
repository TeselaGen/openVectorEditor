var React = require('react');
var _ = require('lodash');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
var ANNOTATION_HEIGHT = require('./editorConstants').ANNOTATION_HEIGHT;
var SPACE_BETWEEN_ANNOTATIONS = require('./editorConstants').SPACE_BETWEEN_ANNOTATIONS;

var RowItem = React.createClass({
  render: function () {

    var row = this.props.row;
    var visibilityParameters = this.props.visibilityParameters;
    // function  (argument) {
    //   // body...
    // }

    if (visibilityParameters.showFeatures) {

      
      var featuresSVG = _.map(row.features, function(annotation) {
        var overlapPaths = annotation.overlaps.map(function(overlap){
          console.log(annotation)
          var xStart = (overlap.start % visibilityParameters.rowLength)*CHAR_WIDTH;
          var xEnd = (overlap.end % visibilityParameters.rowLength)*CHAR_WIDTH;
          var yStart = annotation.yOffset * (ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS);
          var yEnd = ANNOTATION_HEIGHT + annotation.yOffset * (ANNOTATION_HEIGHT + SPACE_BETWEEN_ANNOTATIONS);
          var path = "M"+xStart+","+ yStart
                      +" L"+xEnd+","+ yStart
                      +" L"+xEnd+","+ yEnd
                      +" L"+xStart+","+yEnd+" Z";
          return(<path d={path} stroke="#660000" fill="none"/>);
// fill="transparent" 
//                stroke-width="10" 
//                d="M0,0 L100,100">

// return(<path d="M0,0 L100,100" stroke-width="10" stroke="#006666" fillOpacity=".9" fill="transparent">
//         </path>)

          // return(<circle cx="50" cy="50" r="25" fill="mediumorchid" ></circle>
          //   );
          // var coordinates = { //remember svgs are drawn with 0,0 being the top left of the page
          //   topLeft: "M"+drawStart+","+"0",
          //   topRight: " L"+xEnd+","+"0",
          //   bottomRight: " L"+xEnd+","+ANNOTATION_HEIGHT,
          //   bottomLeft: " L"++drawStart+","+ANNOTATION_HEIGHT+" Z",
          // }
          // var path = coordinates.topLeft + coordinates.topRight + coordinates.bottomRight + coordinates.bottomLeft;

        });
        
        return (overlapPaths);
      })
    }
    var fontSize = CHAR_WIDTH + "px";
    return (
      <div className="infinite-list-item">
        <div className="rowContainer">
          <svg width="100%" height="100%">
            {featuresSVG}

            <text x="0" y="60" fontSize={fontSize} fontFamily="'Courier New', Courier, monospace" style={{"textLength": 100}} lengthAdjust="spacingAndGlyphs">
              {row.sequence}
            </text> 
          </svg>
        </div>
      </div>
    );
  }
});

module.exports = RowItem;
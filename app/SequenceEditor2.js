var React = require('react');

var RowView = require('./RowView');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;

var sequenceData = require('./sequenceData');



var SequenceEditor2 = React.createClass({
  render: function() {
      //   var sequenceData = this.props.sequenceData;
      // var visibilityParameters = this.props.visibilityParameters;
      //   var rows = prepareRowData(sequenceData,visibilityParameters);
      //   var rowItems = rows.map(function(row){
      //     return(<RowItem rowData={row} />);
      //   });
      

      var exampleActiveCutsites = {

      };
      var visibilityParameters = {
        rowLength: 30,
        preloadRowStart: 0,
        preloadRowEnd: 9,
        showOrfs: true,
        showCutsites: true,
        showParts: true,
        showFeatures: true,
        showReverseSequence: true,
        viewportDimensions: {
          height: 700, //come back and make these dynamic
          width: 400
        }
      };
      visibilityParameters.rowWidth = CHAR_WIDTH * visibilityParameters.rowLength;


    return (
      <div>
        <RowView sequenceData={sequenceData} visibilityParameters={visibilityParameters}/>
      </div>
    );
  }
});

module.exports = SequenceEditor2;
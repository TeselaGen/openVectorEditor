var React = require('react');

var RowView = require('./RowView');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;

var mixin = require('baobab-react/mixins').branch;


var SequenceEditor2 = React.createClass({
  mixins: [mixin],
  cursors: {
    visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    sequenceData: ['vectorEditorState', 'sequenceData'],
  },

  render: function() {
      //   var sequenceData = this.props.sequenceData;
      // var visibilityParameters = this.props.visibilityParameters;
      //   var rows = prepareRowData(sequenceData,visibilityParameters);
      //   var rowItems = rows.map(function(row){
      //     return(<RowItem rowData={row} />);
      //   });
      

      // var exampleActiveCutsites = {

      // };
      // var visibilityParameters = {
      //   rowLength: 30,
      //   preloadRowStart: 0,
      //   preloadRowEnd: 9,
      //   showOrfs: true,
      //   showCutsites: true,
      //   showParts: true,
      //   showFeatures: true,
      //   showReverseSequence: true,
      //   viewportDimensions: {
      //     height: 700, //come back and make these dynamic
      //     width: 400
      //   }
      // };
      var visibilityParameters = this.state.visibilityParameters;
      visibilityParameters.rowWidth = CHAR_WIDTH * visibilityParameters.rowLength;


    return (
      <div>
        <RowView {...visibilityParameters} sequenceData={this.state.sequenceData} />
      </div>
    );
  }
});

module.exports = SequenceEditor2;
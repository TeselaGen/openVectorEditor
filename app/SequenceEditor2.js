var React = require('react');

var RowView = require('./RowView');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;

var mixin = require('baobab-react/mixins').branch;
var Authentication = require('./Authentication.js');


var SequenceEditor2 = React.createClass({
  mixins: [mixin, Authentication],
  facets: {
    sequenceLength: 'sequenceLength',
    bpsPerRow: 'bpsPerRow',
    totalRows: 'totalRows',
  },
  // cursors: {
  //   visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
  //   sequenceData: ['vectorEditorState', 'sequenceData'],
  //   highlightLayer: ['vectorEditorState', 'highlightLayer'],
  // },

  render: function() {
      // var visibilityParameters = this.state.visibilityParameters;
      // var highlightLayer = this.state.highlightLayer;
      // visibilityParameters.rowWidth = CHAR_WIDTH * visibilityParameters.bpsPerRow;
 

    return (
      <div style={{float:"right"}}>
        sequence length: {this.state.sequenceLength}
        <br/>
        bpsPerRow:  {this.state.bpsPerRow}
        <br/>
        totalRows:  {this.state.totalRows}
        <RowView />
      </div>
    );
  }
});

module.exports = SequenceEditor2;
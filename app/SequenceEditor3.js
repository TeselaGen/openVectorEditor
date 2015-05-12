var React = require('react');

var RowView = require('./RowView');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;

var mixin = require('baobab-react/mixins').branch;
var Authentication = require('./Authentication.js');


var SequenceEditor3 = React.createClass({
  mixins: [mixin, Authentication],
  cursors: {
    visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
    sequenceData: ['vectorEditorState', 'sequenceData'],
    highlightLayer: ['vectorEditorState', 'highlightLayer'],
  },

  render: function() {
      var visibilityParameters = this.state.visibilityParameters;
      var highlightLayer = this.state.highlightLayer;
      visibilityParameters.rowWidth = CHAR_WIDTH * visibilityParameters.rowLength;


    return (
      <div>
        <RowView {...visibilityParameters} sequenceData={this.state.sequenceData} highlightLayer={this.state.highlightLayer} />
      </div>
    );
  }
});

module.exports = SequenceEditor3;
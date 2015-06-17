var React = require('react');

var RowView = require('./RowView');
var charWidth = require('./editorConstants').charWidth;

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
      visibilityParameters.rowWidth = charWidth * visibilityParameters.bpsPerRow;


    return (
      <div>
        <RowView {...visibilityParameters} sequenceData={this.state.sequenceData} highlightLayer={this.state.highlightLayer} />
      </div>
    );
  }
});

module.exports = SequenceEditor3;
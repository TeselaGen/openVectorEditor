var React = require('react');

var RowView = require('./RowView');
var charWidth = require('./editorConstants').charWidth;

var baoababBranch = require('baobab-react/mixins').branch;
var MousetrapMixin = require('./MousetrapMixin');
var appActions = require('./actions/appActions');

// var Authentication = require('./Authentication.js');


var SequenceEditor2 = React.createClass({
  mixins: [baoababBranch, MousetrapMixin],
  facets: {
    sequenceLength: 'sequenceLength',
    bpsPerRow: 'bpsPerRow',
    orfData: 'orfData',
    totalRows: 'totalRows',
  },
  cursors: {
    caretPosition: ['vectorEditorState', 'caretPosition'],
    selectionLayer: ['vectorEditorState', 'selectionLayer'],
  },
  // cursors: {
  //   visibilityParameters: ['vectorEditorState', 'visibilityParameters'],
  //   sequenceData: ['vectorEditorState', 'sequenceData'],
  //   highlightLayer: ['vectorEditorState', 'highlightLayer'],
  // },

  componentDidMount: function (argument) {
    //bind a bunch of keyboard shortcuts we're interested in catching
    //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
    this.bindShortcut(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',], function (event) { // Handle shortcut 

      console.log(String.fromCharCode(event.charCode));
      // insertSequenceString: function (sequenceString) {
    //trigger an insert action
    appActions.insertSequenceString(String.fromCharCode(event.charCode));
  // },

    });
  },

  render: function() {
      // var visibilityParameters = this.state.visibilityParameters;
      // var highlightLayer = this.state.highlightLayer;
      // visibilityParameters.rowWidth = charWidth * visibilityParameters.bpsPerRow;
 

    return (
      <div style={{float:"right"}}>
        selectionLayer: {this.state.selectionLayer.start}  {this.state.selectionLayer.end}
        <br/>
        caretPosition: {this.state.caretPosition}
        <br/>
        sequence length: {this.state.sequenceLength}
        <br/>
        bpsPerRow:  {this.state.bpsPerRow}
        <br/>
        orfData:  {this.state.orfData}
        <br/>
        totalRows:  {this.state.totalRows}
        <RowView />
      </div>
    );
  }
});

module.exports = SequenceEditor2;
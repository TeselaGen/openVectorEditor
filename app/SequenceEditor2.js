var React = require('react');

var RowView = require('./RowView');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;



var SequenceEditor2 = React.createClass({
  render: function() {
      //   var sequenceData = this.props.sequenceData;
      // var visibilityParameters = this.props.visibilityParameters;
      //   var rows = prepareRowData(sequenceData,visibilityParameters);
      //   var rowItems = rows.map(function(row){
      //     return(<RowItem rowData={row} />);
      //   });
      var sequenceData = {
        sequence: "atatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagagatatattgagagaatattgagagagagatatattgagagagagatatattgagagaatattgagagagagatatattgagagagagatatattgagagaatattgagagagagatatattgagagagagatatattgagagaatattgagagagagatatattgagagagagatatattgagagaatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagagatatattgagagagag",
        features: {
          12355134: {
            id: "12355134",
            start: 4,
            end: 5,
            name: 'cooljim',
            color: 'orange',
            topStrand: true,
            annotationType: "feature"
          },
          1235775134: {
            id: "1235775134",
            start: 5,
            end: 4,
            name: 'cooljim',
            color: 'orange',
            topStrand: false,
            annotationType: "feature"
          },
          1235515134: {
            id: "1235515134",
            start: 45,
            end: 5,
            name: 'cooljim',
            color: 'blue',
            topStrand: true,
            annotationType: "feature"
          },
          222: {
            id: "222",
            start: 24,
            end: 53,
            name: 'cooljim',
            color: 'orange',
            topStrand: true,
            annotationType: "feature"
          }
        },
        parts: {
          123141434: {
            id: "123141434",
            start: 4,
            end: 5,
            name: 'cooljim',
            color: 'pink',
            topStrand: true,
            annotationType: "part"
          },
          12311321334: {
            id: "12311321334",
            start: 45,
            end: 5,
            name: 'cooljim',
            color: 'orange',
            topStrand: true,
            annotationType: "part"
          },
          121234134: {
            id: "121234134",
            start: 24,
            end: 53,
            name: 'cooljim',
            color: 'orange',
            topStrand: true,
            annotationType: "part"
          }
        }
      };

      var exampleActiveCutsites = {

      }
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
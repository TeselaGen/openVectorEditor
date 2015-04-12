var React = require('react');
var fakedata = require('./fakedata.js');
var SequenceLine = require('./SequenceLine.js');
var Authentication = require('./Authentication.js');
var auth = require('./auth.js');
// var d3 = require('d3-browserify');




var divStyle = {
  parentBox: {
    display: "flex",
    width: "100"
  },
  sequenceBox: {
    fontFamily: 'Courier',
    width: "100%"  
  },
  sequence: {
    fontFamily: 'Courier',
    width: "100%"  
  }
};

var sequenceLength = fakeSequenceData.sequence.length;

var GridBody = React.createClass({
    getInitialState: function() {
        return {
            shouldUpdate: true,
            total: 0,
            displayStart: 0,
            displayEnd: 0
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var shouldUpdate = !(
            nextProps.visibleStart >= this.state.displayStart &&
            nextProps.visibleEnd <= this.state.displayEnd
        ) || (nextProps.total !== this.state.total);

        if (shouldUpdate) {
            this.setState({
                shouldUpdate: shouldUpdate,
                total: nextProps.total,
                displayStart: nextProps.displayStart,
                displayEnd: nextProps.displayEnd
            });
        } else {
            this.setState({shouldUpdate: false});
        }
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return this.state.shouldUpdate;
    },
    
    render: function() {
        var columns = {};
        
        columns.top = (
            <tr id="gridgridrectop" line="top" style={{height: this.props.displayStart * this.props.recordHeight}}>
                <td colspan="200"></td>
            </tr>
        );

        for (var i = this.props.displayStart; i < this.props.displayEnd; i++) {
          columns[i] = (
            <div style={divStyle.sequence}>
              {this.props.records[i]}
            </div>
        );
      }
        columns.bottom = (
            <tr id="gridgridrecbottom" line="bottom" style={{height: (this.props.records.length - this.props.displayEnd) * this.props.recordHeight}}>
                <td colspan="200"></td>
            </tr>
        );
        
        return (
          <div>
            {columns}
          </div>
        );
    }
});


var SequenceEditor = React.createClass({

  mixins: [ Authentication ],
  
  getDefaultState: function(props) {
      if (!props.records) {
        props.records=[];
      }
      var recordHeight = 25;
      var recordsPerBody = Math.floor((props.height - 2) / recordHeight);
      return {
          total: props.records.length,
          records: props.records,
          recordHeight: recordHeight,
          recordsPerBody: recordsPerBody,
          visibleStart: 0,
          visibleEnd: recordsPerBody,
          displayStart: 0,
          displayEnd: recordsPerBody * 2
      };
  },
  
  componentWillReceiveProps: function(nextProps) {
      this.setState(this.getDefaultState(nextProps));
      this.scrollState(this.state.scroll);
  },
  
  getInitialState: function() {
      return this.getDefaultState(this.props);
  },

  scrollState: function(scroll) {
      var visibleStart = Math.floor(scroll / this.state.recordHeight);
      var visibleEnd = Math.min(visibleStart + this.state.recordsPerBody, this.state.total - 1);

      var displayStart = Math.max(0, Math.floor(scroll / this.state.recordHeight) - this.state.recordsPerBody * 1.5);
      var displayEnd = Math.min(displayStart + 4 * this.state.recordsPerBody, this.state.total - 1);

      this.setState({
          visibleStart: visibleStart,
          visibleEnd: visibleEnd,
          displayStart: displayStart,
          displayEnd: displayEnd,
          scroll: scroll
      });
  },

  onScroll: function(event) {
      this.scrollState(this.refs.scrollable.getDOMNode().scrollTop);
  },
  
  formatNumber: function(number) {
      return (''+number).split('').reverse().join('').replace(/(...)/g, '$1,').split('').reverse().join('').replace(/^,/, '');
  },
  
  getCount: function() {
      return (1 + this.formatNumber(this.state.visibleStart)) +
       '-' + (1 + this.formatNumber(this.state.visibleEnd)) +
       ' of ' + this.formatNumber(this.state.total);
  },


  render: function () {
    return (
      <div id="gridgridbody" class="w2ui-grid-body" style={{top: 38, bottom: 24, left: 0, right: 0, height: 504}}>
        <div id="gridgridrecords" class="w2ui-grid-records" style={{top: 26, 'overflow-x': 'hidden', 'overflow-y': 'auto'}} ref="scrollable" onScroll={this.onScroll}>
          <GridBody
              records={this.state.records}
              total={this.state.records.length}
              visibleStart={this.state.visibleStart}
              visibleEnd={this.state.visibleEnd}
              displayStart={this.state.displayStart}
              displayEnd={this.state.displayEnd}
              recordHeight={this.state.recordHeight}
          />
        </div>
      </div>
    );
  }
});



module.exports = SequenceEditor;
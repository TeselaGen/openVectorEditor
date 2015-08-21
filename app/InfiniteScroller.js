var React = require('react');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

var InfiniteScroller = React.createClass({
  propTypes: {
    averageElementHeight: React.PropTypes.number.isRequired,
    containerHeight: React.PropTypes.number.isRequired,
    preloadRowStart: React.PropTypes.number.isRequired,
    renderRow: React.PropTypes.func.isRequired,
    rowData: React.PropTypes.array.isRequired,
  },
  
  onEditorScroll: function(event) {
    //tnr: we should maybe keep this implemented..
    if (this.adjustmentScroll) {
      //adjustment scrolls are called in componentDidUpdate where we manually set the scrollTop (which inadvertantly triggers a scroll)
      this.adjustmentScroll = false;
      return;
    }

    var infiniteContainer = event.currentTarget;
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    var currentAverageElementHeight = (visibleRowsContainer.getBoundingClientRect().height / this.state.visibleRows.length);
    this.oldRowStart = this.rowStart;
    var newRowStart;
    var distanceFromTopOfVisibleRows = infiniteContainer.getBoundingClientRect().top - visibleRowsContainer.getBoundingClientRect().top;
    var distanceFromBottomOfVisibleRows = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
    var rowsToAdd;
    if (distanceFromTopOfVisibleRows < 0) {
      if (this.rowStart > 0) {
        rowsToAdd = Math.ceil(-1 * distanceFromTopOfVisibleRows / currentAverageElementHeight);
        newRowStart = this.rowStart - rowsToAdd;

        if (newRowStart < 0) {
          newRowStart = 0;
        } 

        this.prepareVisibleRows(newRowStart, this.state.visibleRows.length);
      }
    } else if (distanceFromBottomOfVisibleRows < 0) {
      //scrolling down, so add a row below
      var rowsToGiveOnBottom = this.props.rowData.length - 1 - this.rowEnd;
      if (rowsToGiveOnBottom > 0) {
        rowsToAdd = Math.ceil(-1 * distanceFromBottomOfVisibleRows / currentAverageElementHeight);
        newRowStart = this.rowStart + rowsToAdd;

        if (newRowStart + this.state.visibleRows.length >= this.props.rowData.length) {
          //the new row start is too high, so we instead just append the max rowsToGiveOnBottom to our current preloadRowStart
          newRowStart = this.rowStart + rowsToGiveOnBottom;
        }
        this.prepareVisibleRows(newRowStart, this.state.visibleRows.length);
      }
    } else {
      //we haven't scrolled enough, so do nothing
    }
    this.updateTriggeredByScroll = true;
    //set the averageElementHeight to the currentAverageElementHeight
    // setAverageRowHeight(currentAverageElementHeight);
  },

  componentWillReceiveProps: function(nextProps) {
    var rowStart = this.rowStart;
    var newNumberOfRowsToDisplay = this.state.visibleRows.length;
    this.props.rowData = nextProps.rowData;
    this.prepareVisibleRows(rowStart, newNumberOfRowsToDisplay);
  },

  componentWillUpdate: function() {
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    this.soonToBeRemovedRowElementHeights = 0;
    this.numberOfRowsAddedToTop = 0;
    if (this.updateTriggeredByScroll === true) {
      this.updateTriggeredByScroll = false;
      var rowStartDifference = this.oldRowStart - this.rowStart;
      // console.log('rowStartDifference', rowStartDifference);
      if (rowStartDifference < 0) {
        // scrolling down
        for (var i = 0; i < -rowStartDifference; i++) {
          var soonToBeRemovedRowElement = visibleRowsContainer.children[i];
          if (soonToBeRemovedRowElement) {
            var height = soonToBeRemovedRowElement.getBoundingClientRect().height;
            // console.log('height', height);
            this.soonToBeRemovedRowElementHeights += this.props.averageElementHeight - height;
            // this.soonToBeRemovedRowElementHeights.push(soonToBeRemovedRowElement.getBoundingClientRect().height);
          }
        }
      } else if (rowStartDifference > 0) {
        // console.log('rowStartDifference', rowStartDifference);
        this.numberOfRowsAddedToTop = rowStartDifference;
      }
    }
  },

  componentDidUpdate: function() {
    //strategy: as we scroll, we're losing or gaining rows from the top and replacing them with rows of the "averageRowHeight"
    //thus we need to adjust the scrollTop positioning of the infinite container so that the UI doesn't jump as we 
    //make the replacements
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    var self = this;
    if (this.soonToBeRemovedRowElementHeights) {
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + this.soonToBeRemovedRowElementHeights;
    }
    if (this.numberOfRowsAddedToTop) {
      //we're adding rows to the top, so we're going from 100's to random heights, so we'll calculate the differenece
      //and adjust the infiniteContainer.scrollTop by it
      var adjustmentScroll = 0;

      for (var i = 0; i < this.numberOfRowsAddedToTop; i++) {
        var justAddedElement = visibleRowsContainer.children[i];
        if (justAddedElement) {
          adjustmentScroll += this.props.averageElementHeight - justAddedElement.getBoundingClientRect().height;
          var height = justAddedElement.getBoundingClientRect().height;
        }
      }
      infiniteContainer.scrollTop = infiniteContainer.scrollTop - adjustmentScroll;
    }

    var visibleRowsContainer = React.findDOMNode(this.refs.visibleRowsContainer);
    if (!visibleRowsContainer.childNodes[0]) {
      if (this.props.rowData.length) {
        //we've probably made it here because a bunch of rows have been removed all at once
        //and the visible rows isn't mapping to the row data, so we need to shift the visible rows
        var numberOfRowsToDisplay = this.numberOfRowsToDisplay || 4;
        var newRowStart = this.props.rowData.length - numberOfRowsToDisplay;
        if (!areNonNegativeIntegers([newRowStart])) {
          newRowStart = 0;
        }
        this.prepareVisibleRows(newRowStart , numberOfRowsToDisplay);
        return; //return early because we need to recompute the visible rows
      } else {
        throw new Error('no visible rows!!');
      }
    }
    var adjustInfiniteContainerByThisAmount;

    //check if the visible rows fill up the viewport
    //tnrtodo: maybe put logic in here to reshrink the number of rows to display... maybe...
    if (visibleRowsContainer.getBoundingClientRect().height / 2 <= this.props.containerHeight) {
      //visible rows don't yet fill up the viewport, so we need to add rows
      if (this.rowStart + this.state.visibleRows.length < this.props.rowData.length) {
        //load another row to the bottom
        this.prepareVisibleRows(this.rowStart, this.state.visibleRows.length + 1);
      } else {
        //there aren't more rows that we can load at the bottom so we load more at the top
        if (this.rowStart - 1 > 0) {
          this.prepareVisibleRows(this.rowStart - 1, this.state.visibleRows.length + 1); //don't want to just shift view
        } else if (this.state.visibleRows.length < this.props.rowData.length) {
          this.prepareVisibleRows(0, this.state.visibleRows.length + 1);
        }
      }
    } else if (visibleRowsContainer.getBoundingClientRect().top > infiniteContainer.getBoundingClientRect().top) {
      //scroll to align the tops of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().top - infiniteContainer.getBoundingClientRect().top;
      // console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountTop: '+adjustInfiniteContainerByThisAmount)
      //   this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    } else if (visibleRowsContainer.getBoundingClientRect().bottom < infiniteContainer.getBoundingClientRect().bottom) {
      //scroll to align the bottoms of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
      //   console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountBottom: '+adjustInfiniteContainerByThisAmount)
      //   this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    }
  },

  componentWillMount: function(argument) {
    //this is the only place where we use preloadRowStart
    var newRowStart = 0;
    if (this.props.preloadRowStart < this.props.rowData.length) {
      newRowStart = this.props.preloadRowStart;
    }
    this.prepareVisibleRows(newRowStart, 4);
  },

  componentDidMount: function(argument) {
    //call componentDidUpdate so that the scroll position will be adjusted properly
    //(we may load a random row in the middle of the sequence and not have the infinte container scrolled properly initially, so we scroll to the show the rowContainer)
    this.componentDidUpdate();
  },

  prepareVisibleRows: function(rowStart, newNumberOfRowsToDisplay) { //note, rowEnd is optional
    //setting this property here, but we should try not to use it if possible, it is better to use
    //this.state.visibleRowData.length
    this.numberOfRowsToDisplay = newNumberOfRowsToDisplay;
    var rowData = this.props.rowData;
    if (rowStart + newNumberOfRowsToDisplay > this.props.rowData.length) {
      this.rowEnd = rowData.length - 1;
    } else {
      this.rowEnd = rowStart + newNumberOfRowsToDisplay - 1;
    }
    // console.log('this.rowEnd: ' + this.rowEnd);
    // var visibleRows = this.state.visibleRowsDataData.slice(rowStart, this.rowEnd + 1);
    // rowData.slice(rowStart, this.rowEnd + 1);
    // setPreloadRowStart(rowStart);
    this.rowStart = rowStart;
    if (!areNonNegativeIntegers([this.rowStart, this.rowEnd])) {
      var e = new Error('Error: row start or end invalid!');
      console.warn('e.trace', e.trace);
      throw e;
    }
    var newVisibleRows = rowData.slice(this.rowStart, this.rowEnd + 1);
    this.setState({
      visibleRows: newVisibleRows
    });
  },
  getVisibleRowsContainerDomNode: function() {
    return this.refs.visibleRowsContainer.getDOMNode();
  },


  render: function() {
    var self = this;
    var rowItems = this.state.visibleRows.map(function(row) {
      return self.props.renderRow(row);
    });

    var rowHeight = this.currentAverageElementHeight ? this.currentAverageElementHeight : this.props.averageElementHeight;
    this.topSpacerHeight = this.rowStart * rowHeight;
    this.bottomSpacerHeight = (this.props.rowData.length - 1 - this.rowEnd) * rowHeight;

    var infiniteContainerStyle = {
      height: this.props.containerHeight,
      overflowY: "scroll",
    };
    return (
      <div
        ref="infiniteContainer"
        className="infiniteContainer"
        style={infiniteContainerStyle}
        onScroll={this.onEditorScroll}
        >
          <div ref="topSpacer" className="topSpacer" style={{height: this.topSpacerHeight}}/>
          <div ref="visibleRowsContainer" className="visibleRowsContainer">
            {rowItems}
          </div>
          <div ref="bottomSpacer" className="bottomSpacer" style={{height: this.bottomSpacerHeight}}/>
      </div>
    );
  }
});

module.exports = InfiniteScroller;
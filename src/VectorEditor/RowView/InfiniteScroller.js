import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import areNonNegativeIntegers from 'validate.io-nonnegative-integer-array';

function noop() {}

const InfiniteScoller = React.createClass({
  propTypes: {
    averageElementHeight: PropTypes.number,
    containerHeight: PropTypes.number.isRequired,
    totalNumberOfRows: PropTypes.number.isRequired,
    renderRow: PropTypes.func.isRequired,
    rowToJumpTo: PropTypes.shape({
      row: PropTypes.number,
    }),
    style: PropTypes.object,
    jumpToBottomOfRow: PropTypes.bool,
    containerClassName: PropTypes.string,
    onScroll: PropTypes.func,
  },

  getDefaultProps() {
    return {
      onScroll: noop,
      containerClassName: 'infiniteContainer',
      averageElementHeight: 100,
    };
  },

  scrollTo(row, options={}) {
    const {
      doNotJumpIfRowIsAlreadyVisible=false,
      jumpToBottomOfRow=false,
      
    } = options;
    
    this.jumpToBottomOfRow = jumpToBottomOfRow
    if (row > -1) {
      if (doNotJumpIfRowIsAlreadyVisible && this.isRowActuallyVisible(row)) {
        return // return early because the row is already visible
      }
      this.rowJumpTriggered = true;
      this.rowJumpedTo = row;
      this.prepareVisibleRows(row, this.state.visibleRows.length);
    }
  },

  isRowActuallyVisible(row) {
    // some of the rows may not actually be fully visible, despite their being in the within the visibleRowsContainer (they sit in the buffer above or below the infinite container)
    const potentiallyVisibleRows = this.getVisibleRowsContainerDomNode();
    // const lengthOfPotentiallyVisibleRows = potentiallyVisibleRows.children.length
    const rowIndexInVisibleRowsContainer = row - this.rowStart
    const potentiallyVisibleRow = potentiallyVisibleRows.children[rowIndexInVisibleRowsContainer]
    if (!potentiallyVisibleRow) {
      return false
    }
    const infiniteContainer = ReactDOM.findDOMNode(this.refs.infiniteContainer);
    const icTop = infiniteContainer.getBoundingClientRect().top
    const icBottom = infiniteContainer.getBoundingClientRect().bottom
    const pvTop = potentiallyVisibleRow.getBoundingClientRect().top
    const pvBottom = potentiallyVisibleRow.getBoundingClientRect().bottom
    if ((icTop < pvBottom && icBottom > pvTop) || (icBottom > pvTop && icTop < pvBottom)) {
      return true
    }
    return false
    
  },

  onEditorScroll(event) {
    // tnr: we should maybe keep this implemented..
    if (this.adjustmentScroll) {
      // adjustment scrolls are called in componentDidUpdate where we manually set the scrollTop (which inadvertantly triggers a scroll)
      this.adjustmentScroll = false;
      return;
    }

    let infiniteContainer = event.currentTarget;
    const visibleRowsContainer = ReactDOM.findDOMNode(this.refs.visibleRowsContainer);
    // const currentAverageElementHeight = (visibleRowsContainer.getBoundingClientRect().height / this.state.visibleRows.length);
    this.oldRowStart = this.rowStart;
    const distanceFromTopOfVisibleRows = infiniteContainer.getBoundingClientRect().top - visibleRowsContainer.getBoundingClientRect().top;
    const distanceFromBottomOfVisibleRows = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
    let newRowStart;
    let rowsToAdd;
    if (distanceFromTopOfVisibleRows < 0) {
      if (this.rowStart > 0) {
        rowsToAdd = Math.ceil(-1 * distanceFromTopOfVisibleRows / this.props.averageElementHeight);
        newRowStart = this.rowStart - rowsToAdd;

        if (newRowStart < 0) {
          newRowStart = 0;
        }

        this.prepareVisibleRows(newRowStart, this.state.visibleRows.length);
      }
    } else if (distanceFromBottomOfVisibleRows < 0) {
      // scrolling down, so add a row below
      const rowsToGiveOnBottom = this.props.totalNumberOfRows - 1 - this.rowEnd;
      if (rowsToGiveOnBottom > 0) {
        rowsToAdd = Math.ceil(-1 * distanceFromBottomOfVisibleRows / this.props.averageElementHeight);
        newRowStart = this.rowStart + rowsToAdd;

        if (newRowStart + this.state.visibleRows.length >= this.props.totalNumberOfRows) {
          // the new row start is too high, so we instead just append the max rowsToGiveOnBottom to our current preloadRowStart
          newRowStart = this.rowStart + rowsToGiveOnBottom;
        }
        this.prepareVisibleRows(newRowStart, this.state.visibleRows.length);
      }
    } else { // eslint-disable-line no-empty
      // we haven't scrolled enough, so do nothing
    }
    this.updateTriggeredByScroll = true;
    this.props.onScroll(event);
    // set the averageElementHeight to the currentAverageElementHeight
    // setAverageRowHeight(currentAverageElementHeight);
  },

  componentWillReceiveProps(nextProps) {
    const newNumberOfRowsToDisplay = this.state.visibleRows.length;
    if (nextProps.rowToJumpTo && this.props.rowToJumpTo !== nextProps.rowToJumpTo) {
      this.prepareVisibleRows(nextProps.rowToJumpTo.row, newNumberOfRowsToDisplay);
      this.rowJumpTriggered = true;
      this.rowJumpedTo = nextProps.rowToJumpTo.row;
    } else {
      const rowStart = this.rowStart;
      // we need to set the new totalNumber of rows prop here before calling prepare visible rows
      // so that prepare visible rows knows how many rows it has to work with
      this.prepareVisibleRows(rowStart, newNumberOfRowsToDisplay, nextProps.totalNumberOfRows);
    }
  },

  componentWillUpdate() {
    let visibleRowsContainer = ReactDOM.findDOMNode(this.refs.visibleRowsContainer);
    this.soonToBeRemovedRowElementHeights = 0;
    this.numberOfRowsAddedToTop = 0;
    if (this.updateTriggeredByScroll === true) {
      this.updateTriggeredByScroll = false;
      const rowStartDifference = this.oldRowStart - this.rowStart;
      if (rowStartDifference < 0) {
        // scrolling down
        for (let i = 0; i < -rowStartDifference; i++) {
          const soonToBeRemovedRowElement = visibleRowsContainer.children[i];
          if (soonToBeRemovedRowElement) {
            const height = soonToBeRemovedRowElement.getBoundingClientRect().height;
            this.soonToBeRemovedRowElementHeights += this.props.averageElementHeight - height;
            // this.soonToBeRemovedRowElementHeights.push(soonToBeRemovedRowElement.getBoundingClientRect().height);
          }
        }
      } else if (rowStartDifference > 0) {
        this.numberOfRowsAddedToTop = rowStartDifference;
      }
    }
  },

  componentDidUpdate() {
    // strategy: as we scroll, we're losing or gaining rows from the top and replacing them with rows of the "averageRowHeight"
    // thus we need to adjust the scrollTop positioning of the infinite container so that the UI doesn't jump as we
    // make the replacements
    let infiniteContainer = ReactDOM.findDOMNode(this.refs.infiniteContainer);
    let visibleRowsContainer = ReactDOM.findDOMNode(this.refs.visibleRowsContainer);
    if (this.soonToBeRemovedRowElementHeights) {
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + this.soonToBeRemovedRowElementHeights;
    }
    if (this.numberOfRowsAddedToTop) {
      // we're adding rows to the top, so we're going from 100's to random heights, so we'll calculate the differenece
      // and adjust the infiniteContainer.scrollTop by it
      let adjustmentScroll = 0;

      for (let i = 0; i < this.numberOfRowsAddedToTop; i++) {
        let justAddedElement = visibleRowsContainer.children[i];
        if (justAddedElement) {
          adjustmentScroll += this.props.averageElementHeight - justAddedElement.getBoundingClientRect().height;
        }
      }
      infiniteContainer.scrollTop = infiniteContainer.scrollTop - adjustmentScroll;
    }

    if (!visibleRowsContainer.childNodes[0]) {
      if (this.props.totalNumberOfRows) {
        // we've probably made it here because a bunch of rows have been removed all at once
        // and the visible rows isn't mapping to the row data, so we need to shift the visible rows
        const numberOfRowsToDisplay = this.numberOfRowsToDisplay || 4;
        let newRowStart = this.props.totalNumberOfRows - numberOfRowsToDisplay;
        if (!areNonNegativeIntegers([newRowStart])) {
          newRowStart = 0;
        }
        this.prepareVisibleRows(newRowStart, numberOfRowsToDisplay);
        return; // return early because we need to recompute the visible rows
      }
      throw new Error('no visible rows!!');
    }
    let adjustInfiniteContainerByThisAmount;
    function adjustScrollHeightToRowJump() {
      this.rowJumpTriggered = false;
      const icbr = infiniteContainer.getBoundingClientRect();
      var rowJumpedToIndex = this.state.visibleRows.indexOf(this.rowJumpedTo)
      if (rowJumpedToIndex === -1) {
        console.warn('rowJumpedTo did not work out for row #:',this.rowJumpedTo)
        rowJumpedToIndex = 0
      }
      const vrbr = visibleRowsContainer.children[rowJumpedToIndex].getBoundingClientRect();
      // if a rowJump has been triggered, we need to adjust the row to sit at the top of the infinite container
      if (this.props.jumpToBottomOfRow || this.jumpToBottomOfRow) {
        adjustInfiniteContainerByThisAmount = icbr.bottom - vrbr.bottom;
      } else {
        adjustInfiniteContainerByThisAmount = icbr.top - vrbr.top;
      }
      infiniteContainer.scrollTop = infiniteContainer.scrollTop - adjustInfiniteContainerByThisAmount;
    }
    // check if the visible rows fill up the viewport
    // TODO: maybe put logic in here to reshrink the number of rows to display... maybe...
    if (visibleRowsContainer.getBoundingClientRect().height / 2 <= this.props.containerHeight) {
      // visible rows don't yet fill up the viewport, so we need to add rows
      if (this.rowStart + this.state.visibleRows.length < this.props.totalNumberOfRows) {
        // load another row to the bottom
        this.prepareVisibleRows(this.rowStart, this.state.visibleRows.length + 1);
      } else {
        // there aren't more rows that we can load at the bottom
        if (this.rowStart - 1 > 0) {
          // so we load more at the top
          this.prepareVisibleRows(this.rowStart - 1, this.state.visibleRows.length + 1); // don't want to just shift view
        } else {
          // all the rows are already visible
          if (this.rowJumpTriggered) {
            adjustScrollHeightToRowJump.call(this);
          }
        }
      }
    } else if (this.rowJumpTriggered) {
      adjustScrollHeightToRowJump.call(this);
    } else if (visibleRowsContainer.getBoundingClientRect().top > infiniteContainer.getBoundingClientRect().top) {
      // scroll to align the tops of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().top - infiniteContainer.getBoundingClientRect().top;
      // this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    } else if (visibleRowsContainer.getBoundingClientRect().bottom < infiniteContainer.getBoundingClientRect().bottom) {
      // scroll to align the bottoms of the boxes
      adjustInfiniteContainerByThisAmount = visibleRowsContainer.getBoundingClientRect().bottom - infiniteContainer.getBoundingClientRect().bottom;
      // this.adjustmentScroll = true;
      infiniteContainer.scrollTop = infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
    }
  },

  componentWillMount() {
    let newRowStart = 0;
    if (this.props.rowToJumpTo && this.props.rowToJumpTo.row && (this.props.rowToJumpTo.row < this.props.totalNumberOfRows)) {
      newRowStart = this.props.rowToJumpTo.row;
      this.rowJumpTriggered = true;
      this.rowJumpedTo = this.props.rowToJumpTo.row;
    }
    this.prepareVisibleRows(newRowStart, 4);
  },

  componentDidMount() {
    // call componentDidUpdate so that the scroll position will be adjusted properly
    // (we may load a random row in the middle of the sequence and not have the infinte container scrolled properly
    // initially, so we scroll to show the rowContainer)
    this.componentDidUpdate();
  },

  prepareVisibleRows(rowStart, newNumberOfRowsToDisplay, newTotalNumberOfRows) { // note, rowEnd is optional
    this.numberOfRowsToDisplay = newNumberOfRowsToDisplay;
    const totalNumberOfRows = areNonNegativeIntegers([newTotalNumberOfRows]) ? newTotalNumberOfRows : this.props.totalNumberOfRows;
    if (rowStart > totalNumberOfRows) {
      this.rowStart = totalNumberOfRows;
    } else {
      this.rowStart = rowStart;
    }
    if (rowStart + newNumberOfRowsToDisplay > totalNumberOfRows) {
      this.rowEnd = totalNumberOfRows - 1;
    } else {
      this.rowEnd = rowStart + newNumberOfRowsToDisplay - 1;
    }
    // var visibleRows = this.state.visibleRowsDataData.slice(rowStart, this.rowEnd + 1);
    // rowData.slice(rowStart, this.rowEnd + 1);
    // setPreloadRowStart(rowStart);
    if (!areNonNegativeIntegers([this.rowStart, this.rowEnd])) {
      throw new Error('Error: row start or end invalid!');
    }
    let newVisibleRows = [];
    for (let i = this.rowStart; i <= this.rowEnd; i++) {
      newVisibleRows.push(i);
    }
    // var newVisibleRows = this.rowStart, this.rowEnd + 1);
    this.setState({
      visibleRows: newVisibleRows,
    });
  },

  // public method
  getVisibleRowsContainerDomNode() {
    return ReactDOM.findDOMNode(this.refs.visibleRowsContainer);
  },

  render() {
    const rowItems = this.state.visibleRows.map((i) => this.props.renderRow(i));

    const rowHeight = this.currentAverageElementHeight ? this.currentAverageElementHeight : this.props.averageElementHeight;
    this.topSpacerHeight = this.rowStart * rowHeight;
    this.bottomSpacerHeight = (this.props.totalNumberOfRows - 1 - this.rowEnd) * rowHeight;
    var {style={}} = this.props
    
    const infiniteContainerStyleToPass = {
      height: this.props.containerHeight,
      overflowY: 'scroll',
      ...style
    };

    return (
      <div
        ref="infiniteContainer"
        className={this.props.containerClassName}
        style={infiniteContainerStyleToPass}
        onScroll={this.onEditorScroll}
      >
        <div className="topSpacer" style={{height: this.topSpacerHeight}}/>
        <div ref="visibleRowsContainer" className="visibleRowsContainer">
          {rowItems}
        </div>
        <div ref="bottomSpacer" className="bottomSpacer" style={{height: this.bottomSpacerHeight}}/>
      </div>
    );
  },
});

export default InfiniteScoller;

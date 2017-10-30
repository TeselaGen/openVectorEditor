// // TNR: Old code that I was messing with
// import React from "react";
// // import ReactDOM from "react-dom";
// import areNonNegativeIntegers from "validate.io-nonnegative-integer-array";
// import deepEqual from 'deep-equal';

// function noop() {}

// export default class InfiniteScoller extends React.Component {
//   // propTypes: {
//   //   averageElementHeight: PropTypes.number,
//   //   containerHeight: PropTypes.number.isRequired,
//   //   length: PropTypes.number.isRequired,
//   //   itemRenderer: PropTypes.func.isRequired,
//   //   rowToJumpTo: PropTypes.shape({
//   //     row: PropTypes.number,
//   //   }),
//   //   jumpToBottomOfRow: PropTypes.bool,
//   //   containerClassName: PropTypes.string,
//   //   onScroll: PropTypes.func,
//   // },
//   static defaultProps = {
//     onScroll: noop,
//     containerClassName: "infiniteContainer",
//     averageElementHeight: 100
//   };

//   scrollTo = newRowStart => {
//     if (newRowStart !== null)
//       this.prepareVisibleRows(newRowStart, this.state.visibleRows.length);
//   };

//   onEditorScroll = event => {

//     // const {start, end} = this.getStartAndEnd();
//     // const {length, pageSize} = this.props;
//     // let space = 0;
//     // let from = 0;
//     // let size = 0;
//     // const maxFrom = length - 1;

//     // while (from < maxFrom) {
//     //   const itemSize = this.getSizeOf(from);
//     //   if (itemSize == null || space + itemSize > start) break;
//     //   space += itemSize;
//     //   ++from;
//     // }

//     // const maxSize = length - from;

//     // while (size < maxSize && space < end) {
//     //   const itemSize = this.getSizeOf(from + size);
//     //   if (itemSize == null) {
//     //     size = Math.min(size + pageSize, maxSize);
//     //     break;
//     //   }
//     //   space += itemSize;
//     //   ++size;
//     // }

//     // this.maybeSetState({from, size}, cb);

//     // tnr: we should maybe keep this implemented..
//     if (this.adjustmentScroll) {
//       // adjustment scrolls are called in componentDidUpdate where we manually set the scrollTop (which inadvertantly triggers a scroll)
//       // console.log('adjustin')
//       this.adjustmentScroll = false;
//       return;
//     }

//     let infiniteContainer = event.currentTarget;
//     const visibleRowsContainer = this.visibleRowsContainer
//     // const currentAverageElementHeight = (visibleRowsContainer.getBoundingClientRect().height / this.state.visibleRows.length);
//     // this.oldRowStart = this.rowStart;
//     // console.log('infiniteContainer.getBoundingClientRect().top:',infiniteContainer.getBoundingClientRect().top)
//     // console.log('visibleRowsContainer.getBoundingClientRect().top:',visibleRowsContainer.getBoundingClientRect().top)

//     // console.log('infiniteContainer.getBoundingClientRect().bottom:',infiniteContainer.getBoundingClientRect().bottom)
//     // console.log('visibleRowsContainer.getBoundingClientRect().bottom:',visibleRowsContainer.getBoundingClientRect().bottom)

//     const distanceFromTopOfVisibleRows =
//       infiniteContainer.getBoundingClientRect().top -
//       visibleRowsContainer.getBoundingClientRect().top;
//     const distanceFromBottomOfVisibleRows =
//       visibleRowsContainer.getBoundingClientRect().bottom -
//       infiniteContainer.getBoundingClientRect().bottom;

//     if (distanceFromTopOfVisibleRows < 0) {
//       this.addRowAbove()
//     } else if (distanceFromBottomOfVisibleRows < 0) {
//       this.addRowBelow()
//     }
//     const topRow = visibleRowsContainer.childNodes[0]
//     const bottomRow = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length - 1]
//     if (topRow.getBoundingClientRect().bottom < infiniteContainer.getBoundingClientRect().top) {
//       this.removeRowAbove()
//     }
//     if (bottomRow.getBoundingClientRect().top > infiniteContainer.getBoundingClientRect().bottom) {
//       this.removeRowBelow()
//     }

//     this.updateTriggeredByScroll = true;
//     this.props.onScroll(event);
//     // set the averageElementHeight to the currentAverageElementHeight
//     // setAverageRowHeight(currentAverageElementHeight);
//   };

//   componentWillReceiveProps(nextProps) {
//     const newNumberOfRowsToDisplay = this.state.visibleRows.length;
//     if (
//       nextProps.rowToJumpTo &&
//       this.props.rowToJumpTo !== nextProps.rowToJumpTo
//     ) {
//       this.prepareVisibleRows(
//         nextProps.rowToJumpTo.row,
//         newNumberOfRowsToDisplay
//       );
//       this.rowJumpTriggered = true;
//       this.rowJumpedTo = nextProps.rowToJumpTo.row;
//     } else {
//       // const rowStart = this.rowStart;
//       // we need to set the new totalNumber of rows prop here before calling prepare visible rows
//       // so that prepare visible rows knows how many rows it has to work with
//       // this.prepareVisibleRows(
//       //   rowStart,
//       //   newNumberOfRowsToDisplay,
//       //   nextProps.length
//       // );
//     }
//   }

//   componentWillUpdate() {
//     // let visibleRowsContainer = this.visibleRowsContainer
//     // this.soonToBeRemovedRowElementHeights = 0;
//     // this.numberOfRowsAddedToTop = 0;
//     // if (this.updateTriggeredByScroll === true) {
//     //   this.updateTriggeredByScroll = false;
//     //   const rowStartDifference = this.oldRowStart - this.state.visbleRows[0];
//     //   if (rowStartDifference < 0) {
//     //     // scrolling down
//     //     for (let i = 0; i < -rowStartDifference; i++) {
//     //       const soonToBeRemovedRowElement = visibleRowsContainer.children[i];
//     //       if (soonToBeRemovedRowElement) {
//     //         const height = soonToBeRemovedRowElement.getBoundingClientRect()
//     //           .height;
//     //         // console.log('height', height);
//     //         this.soonToBeRemovedRowElementHeights +=
//     //           this.props.averageElementHeight - height;
//     //         // this.soonToBeRemovedRowElementHeights.push(soonToBeRemovedRowElement.getBoundingClientRect().height);
//     //       }
//     //     }
//     //   } else if (rowStartDifference > 0) {
//     //     // console.log('rowStartDifference', rowStartDifference);
//     //     this.numberOfRowsAddedToTop = rowStartDifference;
//     //   }
//     // }
//   }

//   componentDidUpdate() {
//     // strategy: as we scroll, we're losing or gaining rows from the top and replacing them with rows of the "averageRowHeight"
//     // thus we need to adjust the scrollTop positioning of the infinite container so that the UI doesn't jump as we
//     // make the replacements
//     let infiniteContainer = this.infiniteContainer
//     let visibleRowsContainer = this.visibleRowsContainer
//     if (this.soonToBeRemovedRowElementHeights) {
//       infiniteContainer.scrollTop =
//         infiniteContainer.scrollTop + this.soonToBeRemovedRowElementHeights;
//     }
//     if (this.numberOfRowsAddedToTop) {
//       // we're adding rows to the top, so we're going from 100's to random heights, so we'll calculate the differenece
//       // and adjust the infiniteContainer.scrollTop by it
//       let adjustmentScroll = 0;

//       for (let i = 0; i < this.numberOfRowsAddedToTop; i++) {
//         let justAddedElement = visibleRowsContainer.children[i];
//         if (justAddedElement) {
//           adjustmentScroll +=
//             this.props.averageElementHeight -
//             justAddedElement.getBoundingClientRect().height;
//         }
//       }
//       this.adjustmentScroll = true
//       infiniteContainer.scrollTop =
//         infiniteContainer.scrollTop - adjustmentScroll;
//     }

//     // if (!visibleRowsContainer || !visibleRowsContainer.childNodes[0]) {
//     //   return
//     // }
//     if (!visibleRowsContainer || !visibleRowsContainer.childNodes[0]) {
//       if (this.props.length) {
//         // we've probably made it here because a bunch of rows have been removed all at once
//         // and the visible rows isn't mapping to the row data, so we need to shift the visible rows
//         const numberOfRowsToDisplay = this.state.visibleRows.length || 2;
//         let newRowStart = this.props.length - numberOfRowsToDisplay;
//         if (!areNonNegativeIntegers([newRowStart])) {
//           newRowStart = 0;
//         }
//         this.prepareVisibleRows(newRowStart, numberOfRowsToDisplay);
//         return; // return early because we need to recompute the visible rows
//       }
//       throw new Error("no visible rows!!");
//     }
//     // let adjustInfiniteContainerByThisAmount;
//     // function adjustScrollHeightToRowJump() {
//     //   this.rowJumpTriggered = false;
//     //   const icbr = infiniteContainer.getBoundingClientRect();
//     //   const vrbr = visibleRowsContainer.children[
//     //     this.state.visibleRows.indexOf(this.rowJumpedTo)
//     //   ].getBoundingClientRect();
//     //   // if a rowJump has been triggered, we need to adjust the row to sit at the top of the infinite container
//     //   if (this.props.jumpToBottomOfRow) {
//     //     adjustInfiniteContainerByThisAmount = icbr.bottom - vrbr.bottom;
//     //   } else {
//     //     adjustInfiniteContainerByThisAmount = icbr.top - vrbr.top;
//     //   }
//     //   infiniteContainer.scrollTop =
//     //     infiniteContainer.scrollTop - adjustInfiniteContainerByThisAmount;
//     // }
//     // // check if the visible rows fill up the viewport
//     // // tnrtodo: maybe put logic in here to reshrink the number of rows to display... maybe...
//     // if (
//     //   visibleRowsContainer.getBoundingClientRect().height / 2 <=
//     //   this.props.containerHeight
//     // ) {
//     //   // visible rows don't yet fill up the viewport, so we need to add rows
//     //   if (this.rowStart + this.state.visibleRows.length < this.props.length) {
//     //     // load another row to the bottom
//     //     this.prepareVisibleRows(
//     //       this.rowStart,
//     //       this.state.visibleRows.length + 1
//     //     );
//     //   } else {
//     //     // there aren't more rows that we can load at the bottom
//     //     if (this.rowStart - 1 > 0) {
//     //       // so we load more at the top
//     //       this.prepareVisibleRows(
//     //         this.rowStart - 1,
//     //         this.state.visibleRows.length + 1
//     //       ); // don't want to just shift view
//     //     } else {
//     //       // all the rows are already visible
//     //       if (this.rowJumpTriggered) {
//     //         adjustScrollHeightToRowJump.call(this);
//     //       }
//     //     }
//     //   }
//     // } else if (this.rowJumpTriggered) {
//     //   adjustScrollHeightToRowJump.call(this);
//     // } else if (
//     //   visibleRowsContainer.getBoundingClientRect().top >
//     //   infiniteContainer.getBoundingClientRect().top
//     // ) {
//     //   // scroll to align the tops of the boxes
//     //   adjustInfiniteContainerByThisAmount =
//     //     visibleRowsContainer.getBoundingClientRect().top -
//     //     infiniteContainer.getBoundingClientRect().top;
//     //   // console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountTop: '+adjustInfiniteContainerByThisAmount)
//     //   console.log('adjustInfiniteContainerByThisAmount1 :',adjustInfiniteContainerByThisAmount)
//     //   // this.adjustmentScroll = true;
//     //   // infiniteContainer.scrollTop =
//     //   //   infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
//     // } else if (
//     //   visibleRowsContainer.getBoundingClientRect().bottom <
//     //   infiniteContainer.getBoundingClientRect().bottom
//     // ) {
//     //   // scroll to align the bottoms of the boxes
//     //   adjustInfiniteContainerByThisAmount =
//     //     visibleRowsContainer.getBoundingClientRect().bottom -
//     //     infiniteContainer.getBoundingClientRect().bottom;
//     //     console.log('adjustInfiniteContainerByThisAmount2 :',adjustInfiniteContainerByThisAmount)
//     //   // console.log('!@#!@#!@#!@#!@#!@#!@#adjustInfiniteContainerByThisAmountBottom: '+adjustInfiniteContainerByThisAmount)
//     //   this.adjustmentScroll = true;
//     //   infiniteContainer.scrollTop =
//     //     infiniteContainer.scrollTop + adjustInfiniteContainerByThisAmount;
//     // }
//   }

//   componentWillMount() {
//     let newRowStart = 0;
//     if (
//       this.props.rowToJumpTo &&
//       this.props.rowToJumpTo.row &&
//       this.props.rowToJumpTo.row < this.props.length
//     ) {
//       newRowStart = this.props.rowToJumpTo.row;
//       this.rowJumpTriggered = true;
//       this.rowJumpedTo = this.props.rowToJumpTo.row;
//     }
//     this.prepareVisibleRows(newRowStart, 2);
//   }

//   // componentWillUnmount() {
//   //   const list = ReactDOM.findDOMNode(this.refs.infiniteContainer)
//   //   list.removeEventListener('scroll', this.onEditorScroll);
//   // }

//   componentDidMount() {
//     // const list = ReactDOM.findDOMNode(this.refs.infiniteContainer)
//     // list.addEventListener('scroll', this.onEditorScroll);

//     // call componentDidUpdate so that the scroll position will be adjusted properly
//     // (we may load a random row in the middle of the sequence and not have the infinte container scrolled properly
//     // initially, so we scroll to show the rowContainer)
//     this.componentDidUpdate();
//   }
//   addRowBelow= () => {
//     console.log('addRowBelow')
//     const {visibleRows} = this.state
//     this.setState({
//       visibleRows: [...visibleRows, visibleRows[visibleRows.length-1] + 1]
//     });
//   }
//   addRowAbove= () => {
//     console.log('addRowAbove')
//     const {visibleRows} = this.state
//     this.setState({
//       visibleRows: [visibleRows[0] - 1, ...visibleRows]
//     });
//   }
//   removeRowAbove= () => {
//     console.log('removeRowAbove')
//     const {visibleRows} = this.state
//     this.setState({
//       visibleRows: visibleRows.slice(1)
//     });
//   }
//   removeRowBelow= () => {
//     console.log('removeRowBelow')
//     const {visibleRows} = this.state
//     this.setState({
//       visibleRows: visibleRows.slice(0, -1)
//     });
//   }

//   prepareVisibleRows = (rowStart, newNumberOfRowsToDisplay, newlength) => {
//     // note, rowEnd is optional
//     this.numberOfRowsToDisplay = newNumberOfRowsToDisplay;
//     const length = areNonNegativeIntegers([newlength])
//       ? newlength
//       : this.props.length;
//     if (rowStart + newNumberOfRowsToDisplay > length) {
//       this.rowEnd = length - 1;
//     } else {
//       this.rowEnd = rowStart + newNumberOfRowsToDisplay - 1;
//     }
//     // console.log('this.rowEnd: ' + this.rowEnd);
//     // var visibleRows = this.state.visibleRowsDataData.slice(rowStart, this.rowEnd + 1);
//     // rowData.slice(rowStart, this.rowEnd + 1);
//     // setPreloadRowStart(rowStart);
//     this.rowStart = rowStart;
//     if (!areNonNegativeIntegers([this.rowStart, this.rowEnd])) {
//       throw new Error("Error: row start or end invalid!");
//     }
//     let newVisibleRows = [];
//     for (let i = this.rowStart; i <= this.rowEnd; i++) {
//       newVisibleRows.push(i);
//     }

//     // if (newVisibleRows.length && deepEqual(newVisibleRows, this.state.visibleRows)) {
//     //   return
//     // }
//     // console.log("newVisibleRows:", newVisibleRows);
//     // var newVisibleRows = this.rowStart, this.rowEnd + 1);
//     this.setState({
//       visibleRows: newVisibleRows
//     });
//   };

//   // // public method
//   // getVisibleRowsContainerDomNode = () => {
//   //   return ReactDOM.findDOMNode(this.refs.visibleRowsContainer);
//   // };

//   heightCache = {};
//   elCache = {};

//   getRowItems = () => {
//     return this.state.visibleRows.map(i => {
//       if (this.elCache[i]) {
//         return this.elCache[i];
//       } else {
//         const el = this.props.itemRenderer(i, i);
//         this.elCache[i] = el;
//         return (
//           <span
//             key={i}
//             ref={c => {
//               if (!c) return
//               console.log('hit')
//               this.heightCache[i] = c.getBoundingClientRect().height;
//             }}
//           >
//             {el}
//           </span>
//         );
//       }
//     });
//   };

//   getSizeOf(index) {
//     const {heightCache} = this;
//     return heightCache[index] || 100
//   }

//   getSpaceBefore = (index, heightCache = {}) => {
//     if (heightCache[index] != null) return heightCache[index];

//     // Try the static itemSize.
//     // const {itemSize, itemsPerRow} = this.state;
//     // if (itemSize) {
//     //   return heightCache[index] = Math.floor(index / itemsPerRow) * itemSize;
//     // }

//     // Find the closest space to index there is a heightCached value for.
//     let from = index;
//     while (from > 0 && heightCache[--from] == null);

//     // Finally, accumulate sizes of items from - index.
//     let space = heightCache[from] || 0;
//     for (let i = from; i < index; ++i) {
//       heightCache[i] = space;
//       const itemSize = this.getSizeOf(i);
//       if (itemSize == null) break;
//       space += itemSize;
//     }

//     return heightCache[index] = space;
//   }

//   render() {
//     // const visibleRows =
//     // console.log('visibleRows:',visibleRows)
//     const rowItems = this.getRowItems()

//     const rowHeight = this.currentAverageElementHeight
//       ? this.currentAverageElementHeight
//       : this.props.averageElementHeight;

//     // this.topSpacerHeight = this.rowStart * rowHeight;
//     const topSpacerHeight = this.getSpaceBefore(this.state.visibleRows[0])
//     console.log('topSpacerHeight:',topSpacerHeight)
//     const bottomSpacerHeight = (this.props.length - 1 - this.rowEnd) * rowHeight;

//     const infiniteContainerStyle = {
//       // height: this.props.containerHeight,
//       overflowY: "auto",
//       height: "100%"
//     };
//     return (
//       <div
//         //ref="infiniteContainer"
//         ref={(c) => {
//           if (!c) return
//           this.infiniteContainer = c
//         }}
//         className={this.props.containerClassName}
//         style={infiniteContainerStyle}
//         onScroll={this.onEditorScroll}
//       >
//         <div className="topSpacer" style={{ height: topSpacerHeight }} />
//         <div ref={(c) => {
//           if (!c) return
//           this.visibleRowsContainer = c
//         }} className="visibleRowsContainer">
//           {rowItems}
//         </div>
//         <div
//           ref="bottomSpacer"
//           className="bottomSpacer"
//           style={{ height: bottomSpacerHeight }}
//         />
//       </div>
//     );
//   }
// }

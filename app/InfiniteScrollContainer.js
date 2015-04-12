
var React = require('React');
var Infinite = require('react-infinite');
var VariableInfiniteList = React.createClass({
    getInitialState: function() {
        return {
            // elementHeights: this.generateVariableElementHeights(100),
            isInfiniteLoading: false
        };
    },
    // generateVariableElementHeights: function(number, minimum, maximum) {
    //     minimum = minimum || 40;
    //     maximum = maximum || 100;
    //     var heights = [];
    //     for (var i = 0; i < number; i++) {
    //         heights.push(minimum + Math.floor(Math.random() * (maximum - minimum)));
    //     }
    //     return heights;
    // },
    handleInfiniteLoad: function() {
        // var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        // setTimeout(function() {
          //tnrtodo
        actions.loadMoreRows();
        var newElements = that.generateVariableElementHeights(100);
        that.setState({
            isInfiniteLoading: false,
        });
        // }, 2500);
    },
    elementInfiniteLoad: function() {
        return <div className="infinite-list-item">
            Loading...
        </div>;
    },
    render: function() {
        var elements = this.props.elements;
        // .map(function(el, i) {
        //     return <ListItem key={i} index={i} height={el} lineHeight={el.toString() + "px"}/>;
        // });
debugger;
        return <Infinite elementHeight={this.props.elementHeights}
                         containerHeight={this.props.containerHeight}
                         infiniteLoadBeginBottomOffset={200}
                         onInfiniteLoad={this.handleInfiniteLoad}
                         loadingSpinnerDelegate={this.elementInfiniteLoad()}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         >
                    {elements}
                </Infinite>;
    }
});

module.exports = VariableInfiniteList;
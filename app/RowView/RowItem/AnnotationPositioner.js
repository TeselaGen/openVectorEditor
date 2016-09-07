var React = require('react');

var AnnotationPositioner = React.createClass({
    render: function () {
        return (
            <svg 
                transform={this.props.transform || null}
                // height={this.props.height + 5} 
                className={this.props.className + ' veRowViewAnnotationPosition'} 
                // width={this.props.width + 5}
                // width = "100%"
                style = {{
                    // position: 'absolute',
                    // top: this.props.top,
                    // left: this.props.left,
                    padding: "0 20px"
                    }}
                viewBox="0 0 2000 25" 
                >
                {this.props.children}
            </svg>
        );
    }
});

module.exports = AnnotationPositioner;
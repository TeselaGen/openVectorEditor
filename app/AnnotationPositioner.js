var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var AnnotationPositioner = React.createClass({
  mixins: [PureRenderMixin],
  render: function () {
    return (
      <svg 
        height={this.props.height} 
        width={this.props.width}
        style = {{
            position: 'absolute',
            top: this.props.top,
            left: this.props.left,
          }}
        >
        {this.props.children}
      </svg>
    );
  }
});
module.exports = AnnotationPositioner;

          // key={'feature' + annotation.id + 'start:' + annotationRange.start}

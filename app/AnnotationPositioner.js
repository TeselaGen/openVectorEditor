import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var AnnotationPositioner = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
        return (
      <svg 
        transform={this.props.transform || null}
        height={this.props.height + 5} 
        width={this.props.width + 5}
        style = {{
            position: 'absolute',
            top: this.props.top,
            left: (this.props.left),
        }}
        >
        {this.props.children}
      </svg>
    );
    }
});
export default AnnotationPositioner;

          // key={'feature' + annotation.id + 'start:' + annotationRange.start}

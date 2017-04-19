var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var AnnotationContainerHolder = React.createClass({
    mixins: [PureRenderMixin],

    render: function () {
        return (
      <div
        className={this.props.className || "annotationContainer"}
        // width="100%"
        // style={{height: '30px', position: 'relative', display: 'block'}}
        >
        {this.props.children}
      </div>
    );
    }
});
module.exports = AnnotationContainerHolder;

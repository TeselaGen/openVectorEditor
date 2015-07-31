var React = require('react');

var SequenceContainer = React.createClass({
  render: function () {
    var {sequence, charWidth} = this.props;
    var textHTML = '<text font-family="Courier New, Courier, monospace" x="'+ (charWidth/4) + '" y="10" textLength="'+ (charWidth * (sequence.length)) + '" length-adjust="spacing">' + sequence + '</text>';
    return <svg ref="textContainer" className="textContainer" width="100%" height={charWidth} dangerouslySetInnerHTML={{__html: textHTML}} />;
  }
});
module.exports = SequenceContainer;
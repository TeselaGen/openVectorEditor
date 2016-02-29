import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var mixin = require('./mixin');

import styles from './sequence-container';

@propTypes({
    sequence: PropTypes.string.isRequired,
    charWidth: PropTypes.number.isRequired,
    children: PropTypes.any
})
class SequenceContainer extends React.Component {

    render() {
        var {
            sequence,
            charWidth,
            children
        } = this.props;

        if (charWidth < 10) {
            return null;
        }

        var columns = [];

        for (let i = 0; i < sequence.length; i+=10) {
            var textEl = (<text x={charWidth * i} y={10}>{sequence.slice(i, (i < sequence.length - 10) ? i + 10 : sequence.length)}</text>);
            columns.push(textEl);
        }

        return (
            <div className={styles.sequenceContainer}>
                <svg ref="textContainer" className={styles.textContainer} height={charWidth}>
                    {columns}
                </svg>
                {children}
            </div>
        )

    }

}

mixin(SequenceContainer, PureRenderMixin);

module.exports = SequenceContainer;

// import React, { PropTypes } from 'react';
// import mixin from './mixin';
// import styles from './sequence-container';

// @propTypes({
//     sequence: PropTypes.string.isRequired,
//     charWidth: PropTypes.number.isRequired,
//     children: PropTypes.any
// })

// class SequenceContainer extends React.Component {

//     render() {
//         var {
//             sequence,
//             charWidth,
//             children
//         } = this.props;

//         if (charWidth < 10) {
//             return null;
//         }

//         var columns = [];

//         for (let i = 0; i < sequence.length; i+=10) {
//             let textHTML = `<text x="${charWidth * i + i / 10 * charWidth}" y="10" textLength="${charWidth * 10}" length-adjust="spacing">${sequence.slice(i, i + 10)}</text>`;
//             columns.push(textHTML);
//         }

//         return (
//             <div className={styles.sequenceContainer}>
//                 <svg ref="textContainer" width="100%" height={charWidth} dangerouslySetInnerHTML={{__html: columns.join('')}} />
//                 {children}
//             </div>
//         )
//     }

// }

// mixin(SequenceContainer, PureRenderMixin);

// module.exports = SequenceContainer;

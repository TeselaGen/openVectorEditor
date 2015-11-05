import React, { PropTypes } from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies

import { Decorator as Cerebral } from 'cerebral-react';

import styles from './status-bar.css';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    selectedSeqMeltingTemp: ['selectedSeqMeltingTemp'],
    caretPosition: ['caretPosition'],
    selectionLayer: ['selectionLayer'],
})
@propTypes({
    sequenceLength: PropTypes.number.isRequired,
    selectedSeqMeltingTemp: PropTypes.number.isRequired,
    caretPosition: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
})
export default class StatusBar extends React.Component {

    render() {
        var {
            sequenceLength,
            selectedSeqMeltingTemp,
            caretPosition,
            selectionLayer
        } = this.props;

        var selectionStart = (selectionLayer.start != -1) ? selectionLayer.start : '--';
        var selectionEnd = (selectionLayer.end != -1) ? selectionLayer.end : '--';

        return (
            <div ref="statusBar">
                <div className={styles.bar}>
                    <div className={styles.box}>
                        <div className={styles.label}>Length</div>
                        <div className={styles.data}>{sequenceLength}</div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.label}>Melting Temp.</div>
                        <div className={styles.data}>{selectedSeqMeltingTemp}</div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.label}>Cursor</div>
                        <div className={styles.data}>{caretPosition}</div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.label}>Selection</div>
                        <div className={styles.data}>
                            {selectionStart} : {selectionEnd}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

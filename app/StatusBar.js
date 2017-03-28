import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './status-bar.css';
import IconButton from 'material-ui/lib/icon-button';
import Undo from 'material-ui/lib/svg-icons/content/undo';
import Redo from 'material-ui/lib/svg-icons/content/redo';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    selectedSeqMeltingTemp: ['selectedSeqMeltingTemp'],
    caretPosition: ['caretPosition'],
    selectionLayer: ['selectionLayer'],
    readOnly: ['readOnly'],
    history: ['history'],
    historyIdx: ['historyIdx'],
})

export default class StatusBar extends React.Component {
    render() {
        var {
            sequenceLength,
            selectedSeqMeltingTemp,
            caretPosition,
            selectionLayer,
            readOnly,
            signals,
            history,
            historyIdx,
        } = this.props;
        var selectionStart = (selectionLayer.start != -1) ? selectionLayer.start : '--';
        var selectionEnd = (selectionLayer.end != -1) ? selectionLayer.end : '--';

        return (
            <div ref="statusBar">
                <div className = { styles.bar }>
                    {readOnly ? <div></div>
                              : <div>
                                    <IconButton
                                        label="undo"
                                        tooltip="undo"
                                        tooltipPosition="top-center"
                                        disabled={historyIdx === 0}
                                        onTouchTap={function() {
                                            signals.updateHistory({ idx: -1 });
                                        }}
                                        >
                                        <Undo />
                                    </IconButton>
                                    <IconButton
                                        label="redo"
                                        tooltip="redo"
                                        tooltipPosition="top-center"
                                        disabled={history.length === historyIdx+1}
                                        onTouchTap={function() {
                                            signals.updateHistory({ idx: 1 });
                                        }}
                                        >
                                        <Redo />
                                    </IconButton>
                                </div>
                    }

                    {readOnly ? <div className={styles.label}>Read Only Mode</div>
                              : <div className={styles.label}>Editing Allowed</div>
                    }

                    <div className={styles.box}>
                        <div className={styles.label}>Length</div>
                        <div className={styles.data}>{sequenceLength}</div>
                    </div>

                    <div className={styles.box} style={{display: 'none'}}>
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

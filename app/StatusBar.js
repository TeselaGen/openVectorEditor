import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './status-bar.css';

import Dialog from 'material-ui/lib/dialog';
import Help from 'material-ui/lib/svg-icons/action/help';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import InvertColors from 'material-ui/lib/svg-icons/action/invert-colors';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Redo from 'material-ui/lib/svg-icons/content/redo';
import Undo from 'material-ui/lib/svg-icons/content/undo';

@Cerebral({
    caretPosition: ['caretPosition'],
    embedded: ['embedded'],
    history: ['history'],
    historyIdx: ['historyIdx'],
    readOnly: ['readOnly'],
    selectionLayer: ['selectionLayer'],
    selectedSeqMeltingTemp: ['selectedSeqMeltingTemp'],
    sequenceLength: ['sequenceLength']
})

export default class StatusBar extends React.Component {

    constructor() {
        super(arguments);
        this.state = {
            showShortcuts: false,
            showAbout: false,
        };
    }

    toggleShortcuts(input) {
        if (input) {
            this.setState({ showShortcuts: true });
        } else {
            this.setState({ showShortcuts: false });
        }
    }

    toggleAbout(input) {
        if (input) {
            this.setState({ showAbout: true });
        } else {
            this.setState({ showAbout: false });
        }
    }

    render() {
        var {
            embedded,
            sequenceLength,
            selectedSeqMeltingTemp,
            selectionLayer,
            readOnly,
            signals,
            history,
            historyIdx,
        } = this.props;
        var caretPosition = this.props.caretPosition + 1;
        var selectionStart = (selectionLayer.start != -1) ? selectionLayer.start + 1 : '--';
        var selectionEnd = (selectionLayer.end != -1) ? selectionLayer.end + 1 : '--';

        // {{}} needs styling
        var shortcuts = (
            <div><ul style={{lineHeight:'2em'}}>
                <li>Left/Right:  move caret left/right</li>
                <li>Up/Down:  move caret up/down one row</li>
                <li>Shift + Left/Right:  extend or shorten selection by one caret to the left/right</li>
                <li>Shift + Up/Down:  extend or shorten selection up/down by one row</li>
                <br/>
                <li>Mod + Left/Right:  move caret to the beginning/end of row</li>
                <li>Mod + Up/Down:  move caret to the beginning/end of sequence</li>
                <li>Mod + Shift + Left/Right:  extend selection to the beginning/end of row</li>
                <li>Mod + Shift + Up/Down:  extend selection to the beginning/end of sequence</li>
                <br/>
                <li>Cmd + a:  select all</li>
                <li>Cmd + c:  copy</li>
                <li>Cmd + x:  cut</li>
                <li>Cmd + v:  paste</li>
                <li>Cmd + Ctrl + i:  select inverse</li>
                <li>Cmd + z:  undo</li>
                <li>Cmd + y:  redo</li>
                <br/>
                <li>Backspace:  delete base-pair preceding the cursor</li>
            </ul></div>
        );

        if (this.state.showShortcuts) {
            var shortcutsDialog = (
                <Dialog
                className={styles.shortcutsDialog}
                title="Keyboard Shortcuts"
                open={this.state.showShortcuts}
                onRequestClose={this.toggleShortcuts.bind(this, false)}
                >
                { shortcuts }
                </Dialog>
            );
        } else {
            var shortcutsDialog = (
                <div></div>
            );
        }

        // {{}} clearly this needs some editing...
        var about = (
            <div style={{height:'250px', width:'300px'}}>
                <div>JBEI! Behold our awesome logo</div>
                <div>I suppose there is a version number somewhere</div>
                <div>And probably link to github, too</div>
                <div>Lorem ipsum, etc...</div>
            </div>
        );

        if (this.state.showAbout) {
            var aboutDialog = (
                <Dialog
                    title="About Vector Editor"
                    style={{position:'absolute', left:'40%', width:'500px', height:'100%'}}
                    open={this.state.showAbout}
                    onRequestClose={this.toggleAbout.bind(this, false)}
                    >
                    { about }
                </Dialog>
            );
        } else {
            var aboutDialog = (
                <div></div>
            );
        }

        var helpItems = (
            <div>
                <MenuItem
                    style={{padding:'0 20px'}}
                    key={1}
                    primaryText="Keyboard Shortcuts"
                    insetChildren={false}
                    onClick={this.toggleShortcuts.bind(this, true)} />
                <MenuItem
                    style={{padding:'0 20px'}}
                    key={2}
                    primaryText="About"
                    insetChildren={false}
                    onClick={this.toggleAbout.bind(this, true)} />
            </div>
        );

        var helpIcon = (
            <IconButton tooltip="Help"
                tooltipPosition="top-center">
                <Help />
            </IconButton>
        );

        return (
            <div ref="statusBar">
                <div className = { embedded ? styles.barEmbed : styles.bar }>

                    <IconMenu
                        style={{position:'absolute', left:'0'}}
                        iconButtonElement={helpIcon} openDirection="top-right">
                        {helpItems}
                    </IconMenu>

                    { readOnly ? <div></div>
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

                    <IconButton
                        label="selectInverse"
                        tooltip="select inverse"
                        tooltipPosition="top-center"
                        disabled={selectionLayer.start === -1}
                        onTouchTap={function() {
                            signals.selectInverse()
                        }}
                        >
                        <InvertColors />
                    </IconButton>

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

                { shortcutsDialog }
                { aboutDialog }

            </div>
        );
    }
}

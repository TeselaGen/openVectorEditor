import React, {PropTypes} from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Combokeys = require("combokeys");
var combokeys;
var bindGlobalPlugin = require('combokeys/plugins/global-bind');

var RowView = require('./RowView');
var MapView = require('./MapView');
var CircularView = require('./CircularView');

var Clipboard = require('./Clipboard');
import {Decorator as Cerebral} from 'cerebral-view-react';

import ToolBar from './ToolBar';
import StatusBar from './StatusBar';
import AnnotationTable from './AnnotationTable';

import styles from './sequence-editor.css';

@Cerebral({
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow'],
    totalRows: ['totalRows'],
    newRandomRowToJumpTo: ['newRandomRowToJumpTo'],
    selectedSequenceString: ['selectedSequenceString'],
    caretPosition: ['caretPosition'],
    sequenceData: ['sequenceData'],
    selectionLayer: ['selectionLayer'],
    clipboardData: ['clipboardData'],
    showCircular: ['showCircular'],
    showLinear: ['showLinear'],
    showRow: ['showRow'],
    showSidebar: ['showSidebar'],
    cutsites: ['cutsites'],
    orfData: ['orfData']
})
@propTypes({
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    totalRows: PropTypes.number.isRequired,
    newRandomRowToJumpTo: PropTypes.object,
    selectedSequenceString: PropTypes.string.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceData: PropTypes.object.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    clipboardData: PropTypes.object.isRequired,
    showCircular: PropTypes.bool.isRequired,
    showLinear: PropTypes.bool.isRequired,
    showRow: PropTypes.bool.isRequired
})
class SequenceEditor extends React.Component {
    componentDidMount() {
        var {
            sequenceDataInserted,
            backspacePressed,
            selectAll,
            selectInverse,
        } = this.props.signals;
        var self = this;
        combokeys = new Combokeys(document.documentElement);
        // combokeys = new Combokeys(React.findDOMNode(this.refs.sequenceEditor));
        bindGlobalPlugin(combokeys);

        //bind a bunch of keyboard shortcuts we're interested in catching
        //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
        //documentation: https://craig.is/killing/mice
        combokeys.bind(['a', 'c', 'g', 't'], function(event) { // type in bases
            sequenceDataInserted({newSequenceData: {sequence: String.fromCharCode(event.charCode)}});
        });
        combokeys.bind(['left','shift+left'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretLeftOne'});
        });
        combokeys.bind(['right','shift+right'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretRightOne'});
        });
        combokeys.bind(['up','shift+up'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretUpARow'});
        });
        combokeys.bindGlobal(['down','shift+down'] , function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretDownARow'});
        });
        combokeys.bindGlobal(['mod+right','mod+shift+right'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+left','mod+shift+left'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfRow'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+up','mod+shift+up'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToStartOfSequence'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal(['mod+down','mod+shift+down'], function(event) { // Handle shortcut
            self.props.signals.caretMoved({shiftHeld: event.shiftKey, type: 'moveCaretToEndOfSequence'});
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bind('backspace', function(event) { // Handle shortcut
            backspacePressed();
            event.stopPropagation();
            event.preventDefault();
        });
        combokeys.bindGlobal('command+a', function(event) { // Handle shortcut
            selectAll();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+ctrl+i', function(event) { // Handle shortcut
            selectInverse();
            event.stopPropagation();
        });
    }
    // copy and paste events are handled by a listener in the DOM element as listed below
    handlePaste(event) {
        var {
            pasteSequenceString,
        } = this.props.signals;
        event.clipboardData.items[0].getAsString(function(clipboardString) {
            pasteSequenceString({sequenceString:clipboardString});
        });
    }

    handleCopy() {
        var {
            selectionCopied,
        } = this.props.signals;
        selectionCopied();
    }

    componentWillUnmount() {

        // Remove any Mousetrap bindings before unmounting.detach()
        combokeys.detach()
    }
    render() {
        var {
            selectedSequenceString,
            sequenceData,
            showCircular,
            showRow,
            showSidebar,
            cutsites,
            orfData
        } = this.props;

        var table;

        if (showSidebar === 'features') {
            table = (
                <AnnotationTable
                   data={sequenceData.features}
                   />
            );
        } else if (showSidebar === 'cutsites') {
            table = (
                <AnnotationTable
                   data={cutsites}
                   />
            );
        } else if (showSidebar === 'orfs') {
            table = (
                <AnnotationTable
                   data={orfData}
                   />
            );
        }

        return (
            <div ref="sequenceEditor" className={styles.app}>
                <Clipboard
                    value={selectedSequenceString}
                    onCopy={this.handleCopy.bind(this)}
                    onPaste={this.handlePaste.bind(this)}
                />

                <div className={styles.head}>
                    <ToolBar />
                </div>

                <div className={styles.content}>
                    <div className={styles.sideBarSlot} style={(table) ? {} : {display: 'none'}}>
                      {table}
                    </div>

                    <div className={styles.circularViewSlot} style={(showCircular) ? {} : {display: 'none'}}>
                        <CircularView />
                    </div>

                    <div className={styles.rowViewSlot} style={(showRow) ? {} : {display: 'none'}}>
                        <RowView />
                    </div>
                </div>

                <div className={styles.foot}>
                    <StatusBar />
                </div>
            </div>
        );
    }
}

module.exports = SequenceEditor;

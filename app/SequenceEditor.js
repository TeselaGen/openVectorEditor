import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import ToolBar from './ToolBar';
import StatusBar from './StatusBar';
import SideBar from './SideBar';
import styles from './sequence-editor.css';

var assign = require('lodash/object/assign');
var bindGlobalPlugin = require('combokeys/plugins/global-bind');
var CircularView = require('./CircularView/CircularView');
var Clipboard = require('./Clipboard');
var Combokeys = require("combokeys");
var RowView = require('./RowView/RowView');
var combokeys;

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],
    clipboardData: ['clipboardData'],
    cutsites: ['cutsites'],
    cutsitesByName: ['cutsitesByName'],
    embedded: ['embedded'],
    history: ['history'],
    historyIdx: ['historyIdx'],
    newRandomRowToJumpTo: ['newRandomRowToJumpTo'],
    orfData: ['orfData'],
    selectedSequenceString: ['selectedSequenceString'],
    searchLayers: ['searchLayers'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    showCircular: ['showCircular'],
    showRow: ['showRow'],
    showSearchBar: ['showSearchBar'],
    showSidebar: ['showSidebar'],
    sidebarType: ['sidebarType'],
    totalRows: ['totalRows']
})

export default class SequenceEditor extends React.Component {

    componentWillMount() {
        // still trying to fix cross origin problem
        this.props.sequenceData.features.forEach(function(feature) {
            if (!feature.end || feature.end === 0) {
                this.props.signals.updateFeature({ feature : feature });
            }
        }.bind(this));
        // this.props.signals.updateHistory({ newHistory: this.props.sequenceData });
    }

    componentDidMount() {
        var {
            sequenceDataInserted,
            backspacePressed,
            selectAll,
            selectInverse,
            updateHistory
        } = this.props.signals;

        var self = this;
        combokeys = new Combokeys(document.documentElement);
        bindGlobalPlugin(combokeys);

        //bind a bunch of keyboard shortcuts we're interested in catching
        combokeys.bind(['a', 'b', 'c', 'd', 'g', 'h', 'k', 'm', 'n', 'r', 's', 't', 'v', 'w', 'y'], function(event) { // type in bases
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
        combokeys.bindGlobal('command+z', function(event) { // Handle shortcut
            updateHistory({ idx: -1 });
            event.preventDefault();
            event.stopPropagation();
        });
        combokeys.bindGlobal('command+y', function(event) { // Handle shortcut
            updateHistory({ idx: 1 });
            event.preventDefault();
            event.stopPropagation();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.sequenceData !== prevProps.sequenceData) {
            this.props.signals.updateHistory({ newHistory: this.props.sequenceData });
        }
    }

    // copy and paste events are handled by a listener in the DOM element as listed below
    handlePaste(event) {
        var {
            pasteSequenceString,
        } = this.props.signals;

        pasteSequenceString({sequenceString: event.clipboardData.getData("text/plain")});
        event.preventDefault();
    }

    handleCopy(event) {
        /*
        earavina:
        This is an async call leading to a bug
        when copy is successful only if user copies the range twice.
        This action assigns this.props.clipboardData after it has been passed to a system clipboard.
        Replaced with a module used each time the user makes a selection
        */
        // var {
        //     copySelection,
        // } = this.props.signals;
        // copySelection();

        let val = this.props.clipboardData;
        // console.log(val);
        event.clipboardData.setData("application/json", JSON.stringify(val));
        event.clipboardData.setData("text/plain", val.sequence);
        event.preventDefault();
    }

    componentWillUnmount() {
        combokeys.detach()
    }

    render() {
        var {
            clipboardData,
            cutsites,
            embedded,
            orfData,
            selectedSequenceString,
            sequenceData,
            showCircular,
            showRow,
            showSearchBar,
            showSidebar,
            sidebarType
        } = this.props;

        var table;
        var sidebarStyle = {};
        // we need this position relative to place the controller bar in the sidebar
        Object.assign(sidebarStyle, {minWidth: '580px', overflow: 'hidden', borderRight: '1px solid #ccc', position: 'relative'}, (showSidebar) ? {} : {display: 'none'})

        // check if we have just circ or just row and pad it out a little
        // using the bitwise xor here might be a little sketchy
        // {{}} currently not working
        var oneViewOnly = !showSidebar && (showCircular ^ showRow)
        var circularStyle = {}
        if(!showCircular) circularStyle = {display: 'none'}
        if (oneViewOnly) {
            circularStyle = Object.assign(circularStyle, {margin: '0 15%'})
        }
        var rowStyle = {}
        if(embedded || !showRow) rowStyle = {display: 'none'}


        var borderStyle = 'none';
        if (showSearchBar) {
            borderStyle = '1px solid rgb(232,232,232)';
        }
        // this should probably move to the sidebar file
        if (sidebarType === 'Features') {
            table = (
                <SideBar
                   annotations={sequenceData.features}
                   annotationType={sidebarType}
                   />
            );
        } else if (sidebarType === 'Cutsites') {
            table = (
                <SideBar
                   annotations={cutsites}
                   annotationType={sidebarType}
                   />
            );
        } else if (sidebarType === 'Orfs') {
            table = (
                <SideBar
                   annotations={orfData}
                   annotationType={sidebarType}
                   />
            );
        }

        var toolbarStyle = '0px';
        if (showSearchBar) {
            toolbarStyle = '60px';
        }

        return (
            <div ref="sequenceEditor" className={styles.app}>
                <Clipboard
                    value={JSON.stringify(clipboardData)}
                    onCopy={this.handleCopy.bind(this)}
                    onPaste={this.handlePaste.bind(this)}
                />

                <div className={styles.head} style={{marginBottom: toolbarStyle}}>
                    <ToolBar />
                </div>

                <div className={styles.content} id="allViews" style={{borderTop: borderStyle}}>
                    <div className={styles.sideBarSlot} id="sideBar" style={ sidebarStyle }>
                      {table}
                    </div>

                    <div className={styles.circularViewSlot} id="circularView" style={ circularStyle }>
                        <CircularView showCircular={showCircular}/>
                    </div>
                    <div className={styles.rowViewSlot} id="rowView" style={ rowStyle }>
                        <RowView showRow={showRow} sequenceData={sequenceData} />
                    </div>
                </div>

                <div className={styles.foot}>
                    <StatusBar />
                </div>
            </div>
        );
    }
}

import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import ToolBar from './ToolBar';
import StatusBar from './StatusBar';
import SideBar from './SideBar';
import styles from './sequence-editor.css';

var bindGlobalPlugin = require('combokeys/plugins/global-bind');
var CircularView = require('./CircularView/CircularView');
var Clipboard = require('./Clipboard');
var Combokeys = require("combokeys");
var combokeys;
var RowView = require('./RowView/RowView');

@Cerebral({
    bpsPerRow: ['bpsPerRow'],    
    embedded: ['embedded'],
    sequenceLength: ['sequenceLength'],
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
    sidebarType: ['sidebarType'],
    cutsites: ['cutsites'],
    orfData: ['orfData'],
})

export default class SequenceEditor extends React.Component {
    componentDidMount() {
        var {
            sequenceDataInserted,
            backspacePressed,
            selectAll,
            selectInverse,
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
    }
    // copy and paste events are handled by a listener in the DOM element as listed below
    handlePaste(event) {
        var {
            pasteSequenceString,
        } = this.props.signals;
        // event.clipboardData.items[0].getAsString(function(clipboardString) {
        //     pasteSequenceString({sequenceString:clipboardString});
        // });
        // console.log(event.clipboardData.types);
        console.log("json: " + event.clipboardData.getData("application/json"));
        console.log("text: " + event.clipboardData.getData("text/plain"));
        event.preventDefault();
    }

    handleCopy(event) {
        var {
            selectionCopied,
        } = this.props.signals;
        selectionCopied();

        let val = this.props.clipboardData;
        event.clipboardData.setData("application/json", JSON.stringify(val));
        event.clipboardData.setData("text/plain", val.sequence);
        event.preventDefault();
        // console.log(event.clipboardData.types);
    }

    componentWillUnmount() {
        combokeys.detach()
    }

    render() {
        var {
            embedded,
            selectedSequenceString,
            sequenceData,
            showCircular,
            showRow,
            showSidebar,
            sidebarType,
            cutsites,
            orfData,
            showRestrictionEnzymeManager,
            readOnly,
            clipboardData
        } = this.props;

        var table;
        var sidebarStyle = {};
        // we need this position relative to place the controller bar in the sidebar
        Object.assign(sidebarStyle, {minWidth: '580px', overflow: 'hidden', borderRight: '1px solid #ccc', position: 'relative'}, (showSidebar) ? {} : {display: 'none'})

        // this should probably move to the sidebar file
        if (sidebarType === 'Features') {
            table = (
                <SideBar
                   data={sequenceData.features}
                   annotationType={sidebarType}
                   filter={['name', 'type', 'start', 'end', 'strand']}
                   />
            );
        } else if (sidebarType === 'Cutsites') {
            table = (
                <SideBar
                   data={cutsites}
                   annotationType={sidebarType}
                   filter={['name', 'start', 'end', 'strand']}
                   />
            );
        } else if (sidebarType === 'Orfs') {
            table = (
                <SideBar
                   data={orfData}
                   annotationType={sidebarType}
                   filter={['start', 'end', 'length', 'strand', 'frame']}
                   />
            );
        }

        return (
            <div ref="sequenceEditor" className={styles.app} style={embedded ? {width: '600px'} : {}}>
                <Clipboard
                    value={JSON.stringify(clipboardData)}
                    onCopy={this.handleCopy.bind(this)}
                    onPaste={this.handlePaste.bind(this)}
                />

                <div className={styles.head}>
                    <ToolBar />
                </div>

                <div className={styles.content} id="allViews">
                    <div className={styles.sideBarSlot} id="sideBar" style={ sidebarStyle }>
                      {table}
                    </div>

                    <div className={styles.circularViewSlot} id="circularView" style={(showCircular) ? {} : {display: 'none'}}>
                        <CircularView />
                    </div>
                    <div className={styles.rowViewSlot} id="rowView" style={(!embedded) ? {} : {display: 'none'}}>
                        <RowView sequenceData={sequenceData} columnWidth={10} />
                    </div>
                </div>

                <div className={styles.foot}>
                    <StatusBar />
                </div>
            </div>
        );
    }
}
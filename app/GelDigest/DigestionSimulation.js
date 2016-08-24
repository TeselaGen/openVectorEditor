import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showGelDigestDialog: ['showGelDigestDialog'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    cancelButtonValue: ['cancelButtonValue'],
    applyButtonValue: ['applyButtonValue'],
})

export default class DigestionSimulation extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        var {
            signals,
            cancelButtonValue,
            applyButtonValue,
        } = this.props;

        var toOpen = this.props.showGelDigestDialog;

        var actions = [
            <FlatButton
                label={"Cancel"}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />,
            <FlatButton
                label={"OK"}
                style={{color: "#03A9F4"}}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />,
        ];

        return (
            <div>
                <Dialog
                    ref="gelDigest"
                    title="Gel Digest"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toOpen}
                    titleStyle={{color: "white", background: "#3F51B5", paddingBottom: "8px", paddingTop: "8px"}}
                >

                </Dialog>
            </div>
        );
    }

}
import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import DigestTool from './DigestTool';
import Dialog from 'material-ui/lib/Dialog';

export default class DigestTool extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }
    render () {
        let {
            signals,
            showGelDigestDialog,
        } = this.props;

        let toOpen = showGelDigestDialog;

        let actions = [
            <FlatButton
                label={"OK"}
                style={{color: "#a065d3"}}
                onTouchTap={function() {
                    signals.gelDigestDisplay();
                }}
            />
        ];

        return (
            <div align="center">
                <Dialog
                    bodyStyle={{padding:'25px 25px 0 25px'}}
                    ref="gelDigest"
                    title="Gel Digest"
                    autoDetectWindowHeight
                    actions={ actions }
                    open={ toOpen }
                    titleStyle={{padding:'25px 0 0 50px', color:"black", background:"white"}}
                    >
                    <DigestTool></DigestTool>
                </Dialog>
            </div>
        );
    }
}

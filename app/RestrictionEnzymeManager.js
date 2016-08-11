import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import RaisedButton from 'material-ui/lib/raised-button';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
})

export default class RestrictionEnzymeManager extends  React.Component {
    state = {
        open: false,
    };

    // returnState () {
    //     console.log(this.state.open);
    //     console.log(this.state.isOpen);
    //     return this.state.isOpen;
    // }
    //
    // openDialog () {this.setState({open: true});};
    //
    // closeDialog () { this.setState({open: false}); };

    render () {
        var {
            signals,
            showRestrictionEnzymeManager,
        } = this.props;

        var toOpen = showRestrictionEnzymeManager;

        var actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={function() {
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={function() {
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
        ];

        return (
            <div>

                <Dialog
                    title="Restriction Enzyme Manager"
                    actions={actions}
                    open={toOpen}

                >
                    "HIIIIII"
                </Dialog>
            </div>
        );
    }
}
import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import EnzymesDropdown from './EnzymesDropdown';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
})

export default class RestrictionEnzymeManager extends  React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };


    render () {
        var {
            signals,
            showRestrictionEnzymeManager,
        } = this.props;

        var tileLeft = (
            <div>
                <EnzymesDropdown /> <br />
                <TextField
                    ref="enzymeName"
                    style={{position: 'relative'}}
                    floatingLabelText="Enzyme name"
                /> <br />
            </div>
        );

        var tileRight = (
            <div>
                "HII"
            </div>
        );

        var grid = (
            <div>
                <GridList
                    cols={2}
                    cellHeight={200}
                    padding={1}
                >
                    <GridTile>
                        {tileLeft}
                    </GridTile>
                    <GridTile>
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        var toOpen = showRestrictionEnzymeManager;

        var actions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={function() {
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={function() {
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
        ];

        return (
            <div>
                <Dialog
                    ref="enzymeManager"
                    title="Restriction Enzyme Manager"
                    style={{height: '700px'}}
                    actions={actions}
                    open={toOpen}
                >
                        {grid}
                </Dialog>
            </div>
        );
    }
}
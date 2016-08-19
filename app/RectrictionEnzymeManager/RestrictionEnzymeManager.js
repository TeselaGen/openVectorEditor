import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';

import LeftTile from './EnzymesGroups';
import RightTile from './ActiveEnzymes';

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
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
            originalUserEnzymesList,
            currentUserEnzymesList,
        } = this.props;

        var tileLeft = (
            <div>
                <h5>Enzymes groups</h5>
                <LeftTile />
            </div>
        );

        var tileRight = (
            <div>
                <h5>Active enzymes</h5> <br />
                <RightTile /> <br />
            </div>
        );

        var grid = (
            <div>
                <GridList
                    cols={2}
                    cellHeight={600}
                    padding={10}
                >
                    <GridTile rows={1} cols={1}>
                        {tileLeft}
                    </GridTile>
                    <GridTile rows={1} cols={1}>
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
                        signals.updateUserEnzymes({selectedButton: "OK", currentUserList: currentUserEnzymesList, originalUserList: originalUserEnzymesList});
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={function() {
                        signals.updateUserEnzymes({selectedButton: "Cancel", currentUserList: currentUserEnzymesList, originalUserList: originalUserEnzymesList});
                        signals.restrictionEnzymeManagerDisplay();
                    }}
            />,
        ];

        return (
            <div align="center">
                <Dialog
                    ref="enzymeManager"
                    title="Restriction Enzyme Manager"
                    autoDetectWindowHeight={true}
                    actions={actions}
                    open={toOpen}
                > <br />
                        {grid}
                </Dialog>
            </div>
        );
    }
}
import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import LeftTile from './EnzymesGroups';
import RightTile from './ActiveEnzymes';
let assign = require('lodash/object/assign');

const Dialog = require('material-ui/lib/dialog');

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    originalUserEnzymesList: ['originalUserEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList']
})

export default class RestrictionEnzymeManager extends  React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        open: false,
    };

    render () {
        let {
            signals,
            showRestrictionEnzymeManager,
            originalUserEnzymesList,
            currentUserEnzymesList
        } = this.props;

        let tileTitleStyle = {
            textAlign: "center",
            color: "black",
            fontSize: '15px'
        };

        let tileLeft = (
            <div>
                <LeftTile />
            </div>
        );

        let tileRight = (
            <div>
                <RightTile />
            </div>
        );

        let rightTileTitle = (
            <h4 style={tileTitleStyle}>Active enzymes</h4>
        );

        let grid = (
            <div>
                <GridList
                    cols={2}
                    cellHeight={400}
                    padding={10}
                    >
                    <GridTile
                        rows={1}
                        cols={1}
                        >
                        {tileLeft}
                    </GridTile>
                    <GridTile
                        rows={1}
                        cols={1}
                        title={rightTileTitle}
                        titlePosition={"top"}
                        titleBackground="#E0E0E0"
                        >
                        {tileRight}
                    </GridTile>
                </GridList>
            </div>
        );

        let toOpen = showRestrictionEnzymeManager;

        let actionButtons = [
            <FlatButton
                key="cancel"
                label={"Cancel"}
                onTouchTap={function() {
                        signals.updateUserEnzymes({
                            selectedButton: "Cancel",
                            currentUserList: currentUserEnzymesList,
                            originalUserList: originalUserEnzymesList
                        });
                        signals.restrictionEnzymeManagerDisplay();
                    }}
                />,
            <FlatButton
                key="apply"
                label={"Apply"}
                style={{color: "#00bcd4"}}
                onTouchTap={function() {
                        signals.updateUserEnzymes({
                            selectedButton: "Apply",
                            currentUserList: currentUserEnzymesList,
                            originalUserList: originalUserEnzymesList
                        });
                        signals.restrictionEnzymeManagerDisplay();
                    }}
                />,
        ];

        return (
            <div align="center">
                <Dialog
                    bodyStyle={{padding:'25px 25px 0 25px'}}
                    ref="enzymeManager"
                    title="Restriction Enzyme Manager"
                    autoDetectWindowHeight
                    actions={actionButtons}
                    open={toOpen}
                    titleStyle={{padding:'25px 0 0 50px', color:"black", background:"white"}}
                    >
                    {grid}
                </Dialog>
            </div>
        );
    }
}

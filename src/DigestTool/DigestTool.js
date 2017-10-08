import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import FlatButton from 'material-ui/lib/flat-button';
import Paper from 'material-ui/lib/paper';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import Dialog from 'material-ui/lib/Dialog';

import ActiveEnzymes from './ActiveGelEnzymes';
import EnzymesGroups from './GelEnzymesGroups';
import Ladder from './Ladder';

let gridTileTitleStyle = {
    textAlign: "center",
    color: "black",
    fontSize: '15px'
};

let centerTileTitle = (
    <div 
        style={ gridTileTitleStyle }
        >
        Active enzymes
    </div>
);

export default class DigestTool extends React.Component {
    render() {
        return <div>
        <GridList
            cols={3}
            cellHeight={400}
            cellWidth={300}
            padding={10}
            >
            <GridTile
                key="enzymeGroups"
                rows={1}
                cols={1}
                >
                <div>
                    <EnzymesGroups />
                </div>
            </GridTile>
            <GridTile
                key="activeEnzymes"
                rows={1}
                cols={1} 
                title={ centerTileTitle }
                titlePosition={"top"}
                titleBackground="#E0E0E0"
                >
                <div>
                    <ActiveEnzymes />
                </div>
            </GridTile>
            <GridTile
                key="gelLadder"
                rows={1}
                cols={1}
                >
                <div>
                    <Ladder />
                </div>
            </GridTile>
        </GridList>
    </div>
    
    }
}


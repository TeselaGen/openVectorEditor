import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';

export default class RightTile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {

        } = this.props;

        return (
            <div>
                <List>
                    <ListItem primaryText="Outbox" />
                    <ListItem primaryText="Outnox2" />
                </List>
            </div>
    );
    }
}
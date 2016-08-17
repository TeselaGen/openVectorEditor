import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import styles from './manager-list.scss';

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
})

export default class RightTile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var {
            userEnzymeList,
        } = this.props;

        return (
            <div>
                <List className={styles.managerList}>
                    {userEnzymeList.map((enzyme, index) => (
                        <ListItem primaryText={enzyme} />
                    ))}
                </List>
            </div>
    );
    }
}
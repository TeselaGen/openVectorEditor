import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import IconButton from 'material-ui/lib/icon-button';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import styles from './manager-list.scss';

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
})

export default class ActiveEnzymes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUserEnzymesList: this.props.currentUserEnzymesList,
            userEnzymeList: this.props.userEnzymeList,
        };
    }

    render() {
        var {
            currentUserEnzymesList,
            signals,
        } = this.props;

        return (
            <div>
                <br />
                <br />
                <br />
                <List className={styles.managerListRight}>
                    {currentUserEnzymesList.map((enzyme, index) => (
                        <ListItem
                            primaryText={enzyme}
                            rightIconButton={
                                <IconButton
                                    onTouchTap={
                                        function() {
                                            signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                                                enzyme: enzyme, action: "remove"});
                                        }
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>
                            }
                        />
                    ))}
                </List>
            </div>
    );
    }
}
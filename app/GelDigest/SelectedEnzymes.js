import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import IconButton from 'material-ui/lib/icon-button';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import styles from './gel-digest-list.scss';

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    removeEnzymeButtonValue: ['removeEnzymeButtonValue'],
    removeAllEnzymesButtonValue: ['removeAllEnzymesButtonValue'],
})

export default class SelectedEnzymes extends React.Component {
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
            removeEnzymeButtonValue,
            removeAllEnzymesButtonValue,
            signals,
        } = this.props;

        return (
            <div>
                <List className={styles.gelListRight}>
                    {currentUserEnzymesList.map((enzyme, index) => (
                        <ListItem
                            style={{maxHeight: 40}}
                            primaryText={enzyme}
                            rightIconButton={
                                <IconButton
                                    onTouchTap={
                                        function() {
                                            signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                                                enzyme: enzyme, action: removeEnzymeButtonValue});
                                        }
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>
                            }
                        />
                    ))}
                </List>
                <br />
                <RaisedButton
                    label="Remove all"
                    primary={true}
                    onTouchTap={function () {
                        signals.editUserEnzymes({currentUserList: currentUserEnzymesList, action: removeAllEnzymesButtonValue});
                    }}
                />
            </div>
        );
    }
}
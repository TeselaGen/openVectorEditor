import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import IconButton from 'material-ui/lib/icon-button';
import UncheckedIcon from 'material-ui/lib/svg-icons/image/crop-square';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import styles from './manager-list.scss';

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
})

export default class RightTile extends React.Component {
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
                <List className={styles.managerList}>
                    {currentUserEnzymesList.map((enzyme, index) => (
                        <ListItem
                            rightIconButton={
                                <IconButton
                                    onTouchTap={
                                        function() {
                                            signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                                                enzyme: enzyme, action: "delete"});
                                        }
                                    }
                                >
                                    <CloseIcon />
                                </IconButton>}
                            primaryText={enzyme}
                        />
                    ))}
                </List>
            </div>
    );
    }
}

/*

 checked={this.state.snapsToGrid}
 onCheck={this.snapsToGridChecked.bind(this)}
 */
/*
leftIcon={
    <Checkbox
onCheck={function() {
    signals.editUserEnzymes({currentUserList: this.state.currentUserEnzymesList,
        enzyme: enzyme, action: "delete"})
}
}
checkedIcon={<CloseIcon />}
uncheckedIcon={<UncheckedIcon/>}
/>
}
    */
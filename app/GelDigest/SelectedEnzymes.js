import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import IconButton from 'material-ui/lib/icon-button';
import CloseIcon from 'material-ui/lib/svg-icons/navigation/close';
import RaisedButton from 'material-ui/lib/raised-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';


@Cerebral({
    userEnzymeList: ['userEnzymeList'],
})

export default class SelectedEnzymes extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //
        // };
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
                <List>

                </List>
                <br />
                <RaisedButton
                    label="Remove all"
                    primary={true}

                />
            </div>
        );
    }
}
import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import MenuItem from 'material-ui/lib/menu/menu-item';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

const listStyles = {
    list: {
        height: 330,
        overflow: 'scroll',
    },
};

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
})

export default class LeftTile extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange = (event, index, value) => this.setState({value});

    render() {
        var {
            userEnzymeList,
        } = this.props;

        let menuItems = [
            { payload: '1', text: 'Common' },
            { payload: '2', text: 'REBASE' },
            { payload: '3', text: 'Berkeley BioBricks' },
            { payload: '4', text: 'MIT BioBricks' },
            { payload: '5', text: 'Fermentas Fast Digest' },
        ];


        return (
            <div>
                <DropDownMenu

                    menuItems={menuItems}
                />
                <List style={listStyles.list}>
                    <ListItem primaryText="Inbox" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                    <ListItem primaryText="Inbox2" leftCheckbox={<Checkbox />} />
                </List>
            </div>
        );
    }
}

/*
 <TextField
 ref="enzymeName"
 floatingLabelText="Enzyme name"
 />*/
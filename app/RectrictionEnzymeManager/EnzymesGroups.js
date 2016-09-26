import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';
import RaisedButton from 'material-ui/lib/raised-button';
import styles from './manager-list.scss';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

@Cerebral({
    commonEnzymes: ['commonEnzymes'],
    // REBASEEnzymes: ['REBASEEnzymes'],
    berkeleyBBEnzymes: ['berkeleyBBEnzymes'],
    MITBBEnzymes: ['MITBBEnzymes'],
    fastDigestEnzymes: ['fastDigestEnzymes'],
    currentEnzymesList: ['currentEnzymesList'],
    currentUserEnzymesList: ['currentUserEnzymesList'],
    addEnzymeButtonValue: ['addEnzymeButtonValue'],
    addAllEnzymesButtonValue: ['addAllEnzymesButtonValue'],
})

export default class EnzymesGroups extends React.Component {
    constructor(props) {
        super(props);
        this.props.signals.chooseEnzymeList({selectedList: this.props.commonEnzymes});
        this.state = {
            value: 1,
        };
    }

    handleChange = (event, index, value) => {
        this.setState({value: value});
        switch (value.text) {
            case 'REBASE':
                /**/
                break;
            case 'Berkeley BioBricks':
                this.props.signals.chooseEnzymeList({selectedList: this.props.berkeleyBBEnzymes});
                break;
            case 'MIT BioBricks':
                this.props.signals.chooseEnzymeList({selectedList: this.props.MITBBEnzymes});
                break;
            case 'Fermentas Fast Digest':
                this.props.signals.chooseEnzymeList({selectedList: this.props.fastDigestEnzymes});
                break;
            default:
                this.props.signals.chooseEnzymeList({selectedList: this.props.commonEnzymes});
        }
    };

    isChecked = (enzyme) => {
        return (this.props.currentUserEnzymesList.indexOf(enzyme) >= 0);
    };

    render() {
        var {
            currentEnzymesList,
            currentUserEnzymesList,
            addEnzymeButtonValue,
            addAllEnzymesButtonValue,
            signals,
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
                <br />
                <br />
                <br />
                <DropDownMenu
                    onChange={this.handleChange}
                    menuItems={menuItems}
                    style={{backgroundColor: "#311B92"}}
                    underlineStyle={{opacity: 0}}
                    iconStyle={{color: "#000000"}}
                    labelStyle={{fontWeight: 650, fontSize: 15, color: "#FFFFFF"}}
                />
                <br />
                <List className={styles.managerListLeft}>
                    {currentEnzymesList.map((enzyme, index) => (
                        <ListItem
                            style={{maxHeight: 12}}
                            leftCheckbox={
                                <Checkbox
                                    checked={this.isChecked(enzyme)}
                                    disabled={this.isChecked(enzyme)}
                                    onCheck={
                                        function () {
                                            signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                                            enzyme: enzyme, action: addEnzymeButtonValue})
                                        }
                                    }
                                />
                            }
                            primaryText={enzyme}
                        />
                    ))}
                </List>
                <br />
                <RaisedButton
                    label="Add all"
                    secondary={true}
                    onTouchTap={function () {
                        signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                            currentEnzymesList: currentEnzymesList, action: addAllEnzymesButtonValue});
                    }}
                />
            </div>
        );
    }
}
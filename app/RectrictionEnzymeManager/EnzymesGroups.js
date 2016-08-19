import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Checkbox from 'material-ui/lib/checkbox';
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
})

export default class LeftTile extends React.Component {
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
                <DropDownMenu
                    onChange={this.handleChange}
                    menuItems={menuItems}
                />
                <List className={styles.managerList}>
                    {currentEnzymesList.map((enzyme, index) => (
                        <ListItem
                            primaryText={enzyme.name}
                            leftCheckbox={
                                <Checkbox
                                    checked={this.isChecked(enzyme.name)}
                                    disabled={this.isChecked(enzyme.name)}
                                    onCheck={
                                        function () {
                                            signals.editUserEnzymes({currentUserList: currentUserEnzymesList,
                                            enzyme: enzyme.name, action: "add"})
                                        }
                                    }

                                />}
                        />
                    ))}
                </List>
            </div>
        );
    }
}
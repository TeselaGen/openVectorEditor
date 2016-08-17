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

    render() {
        var {
            currentEnzymesList,
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
                        <ListItem primaryText={enzyme.name} />
                    ))}
                </List>
            </div>
        );
    }
}

/*
class LikeButton extends React.Component {
    constructor() {
        super();
        this.state = {
            liked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({liked: !this.state.liked});
    }
    render() {
        const text = this.state.liked ? 'liked' : 'haven\'t liked';
        return (
            <div onClick={this.handleClick}>
        You {text} this. Click to toggle.
        </div>
    );
    }
}
    */
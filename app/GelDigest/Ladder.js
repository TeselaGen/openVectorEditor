import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

export default class EnzymesLists extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
        };
    }

    render() {
        var {
            signals,
        } = this.props;

        let menuItems = [
            { payload: '1', text: 'GeneRuler 1kb Plus DNA' },
            { payload: '2', text: 'GeneRuler 100 bp Plus DNA' },
        ];

        return (
            <div>
                <DropDownMenu
                    menuItems={menuItems}
                    style={{backgroundColor: "#311B92"}}
                    underlineStyle={{opacity: 0}}
                    iconStyle={{color: "#000000"}}
                    labelStyle={{fontWeight: 650, fontSize: 17, color: "#FFFFFF"}}
                />

            </div>
        );
    }
}
import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
    geneRuler1kb: ['geneRuler1kb'],
    geneRuler100bp: ['geneRuler100bp'],
    currentGeneRuler: ['geneRuler1kb'],
})

export default class EnzymesLists extends React.Component {
    constructor(props) {
        super(props);
        this.props.signals.chooseGeneRuler({selectedRuler: this.props.geneRuler1kb});
        this.state = {
            value: 1,
        };
    }

    handleChange = (event, index, value) => {
        this.setState({value: value});
        switch (value.text) {
            case 'GeneRuler 1kb Plus DNA':
                this.props.signals.chooseGeneRuler({selectedRuler: this.props.geneRuler1kb});
                break;
            case 'GeneRuler 100 bp Plus DNA':
                this.props.signals.chooseGeneRuler({selectedRuler: this.props.geneRuler100bp});
                break;
            default:
                this.props.signals.chooseGeneRuler({selectedRuler: this.props.geneRuler1kb});
        }
    };

    render() {
        var {
            userEnzymeList,
            currentGeneRuler,
            signals,
        } = this.props;

        let menuItems = [
            { payload: '1', text: 'GeneRuler 1kb Plus DNA' },
            { payload: '2', text: 'GeneRuler 100 bp Plus DNA' },
        ];

        var fragmentsCount;
        if (userEnzymeList.length == 0) {
            fragmentsCount = (
                <div>No digestion</div>
            );
        } else {
            fragmentsCount = (
                <div>{userEnzymeList.length + 1} fragments</div>
            );
        }

        var fragments;
        var upperBoundary = currentGeneRuler[0];

        return (
            <div>
                <DropDownMenu
                    onChange={this.handleChange}
                    menuItems={menuItems}
                    style={{backgroundColor: "#311B92"}}
                    underlineStyle={{opacity: 0}}
                    iconStyle={{color: "#000000"}}
                    labelStyle={{fontWeight: 650, fontSize: 17, color: "#FFFFFF"}}
                />
                {fragmentsCount}
                {fragments}
            </div>
        );
    }
}
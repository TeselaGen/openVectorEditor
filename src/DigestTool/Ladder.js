import React from 'react';
import styles from './ruler.css';

import {List, DropDownMenu} from 'material-ui';
// import DropDownMenu from 'material-ui/lib/drop-down-menu';

// @Cerebral({
//     gelDigestEnzymes: ['gelDigestEnzymes'],
//     fragments: ['fragments'],
//     fragmentsNum: ['fragmentsNum'],
// })

export default class Ladder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            geneRuler: 'geneRuler1kb'
        }
        this.props.signals && this.props.signals.createFragmentsLines({ geneRuler: 'geneRuler1kb', enzymes: this.props.gelDigestEnzymes });
    }

    handleChange = (event, index, value) => {
        let geneRuler;
        if (value.text === 'GeneRuler 100bp + DNA') {
            geneRuler = "geneRuler100bp";
        } else {
            geneRuler = "geneRuler1kb";
        }
        this.setState({ geneRuler });
        this.props.signals.createFragmentsLines({ geneRuler, enzymes: this.props.gelDigestEnzymes });
    };

    componentWillReceiveProps(newProps) {
        if (newProps.gelDigestEnzymes !== this.props.gelDigestEnzymes) {
            this.props.signals.createFragmentsLines({ geneRuler: this.state.geneRuler, enzymes: newProps.gelDigestEnzymes });
        }
    }

    render() {
        let {
            gelDigestEnzymes=[],
            fragments=[],
            fragmentsNum,
        } = this.props;

        let menuItems = [
            { payload: '1', text: 'GeneRuler 1kb + DNA' },
            { payload: '2', text: 'GeneRuler 100bp + DNA' },
        ];

        let fragmentsCount;
        let pluralFragments = "fragments";
        let pluralEnzymes = "enzymes";
        if (gelDigestEnzymes.length == 0) {
            fragmentsCount = (
                <div className={styles.fragmentsNumLabel}>No digestion</div>
            );
        } else {
            if (fragmentsNum === 1) {
                pluralFragments = "fragment";
            }
            if (gelDigestEnzymes.length === 1) {
                pluralEnzymes = "enzyme";
            }
            fragmentsCount = (
                <div className={styles.fragmentsNumLabel}>
                    <div style={{float:'left'}}>{fragmentsNum} {pluralFragments}</div>
                    <div style={{float:'right'}}>{gelDigestEnzymes.length} {pluralEnzymes}</div>
                </div>
            );
        }

        return (
            <div>
                <DropDownMenu
                    onChange={this.handleChange}
                    menuItems={menuItems}
                    style = {{backgroundColor: "#E0E0E0", zIndex:'20', width:'100%'}}
                    underlineStyle={{opacity: 0}}
                    iconStyle={{fill: "black"}}
                    labelStyle={{fontSize: 15, color: "black", lineHeight:'48px'}}
                    />

                {fragmentsCount}

                <List className={styles.managerListLadder}>
                    {fragments.map((fragment, index) => (
                        <div className={styles.tooltip} key={index}
                            style={{bottom: fragment.bottom, left: fragment.left, width: fragment.width}}>
                            <span className={styles.tooltiptext}>
                                {fragment.tooltip}
                            </span>
                            <hr style={{margin:'0'}} className={fragment.align == "left" ? styles.left : styles.right}/>
                        </div>
                    ))}
                </List>
            </div>
        );
    }
}

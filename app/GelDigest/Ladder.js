import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

import Paper from 'material-ui/lib/paper';
import styles from './ruler.scss';

const DropDownMenu = require('material-ui/lib/drop-down-menu');

@Cerebral({
    userEnzymeList: ['userEnzymeList'],
    geneRuler1kb: ['geneRuler1kb'],
    geneRuler100bp: ['geneRuler100bp'],
    currentGeneRuler: ['geneRuler1kb'],
    cutsites: ['cutsites'],
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
            cutsites,
            signals,
        } = this.props;

        var paperBlockStyle = {
            height: "700px",
            width: "99%",
            padding: "2px",
            paddingTop: "5px",
            paddingBottom: "5 px",
            overflow: "scroll",
        };

        let menuItems = [
            { payload: '1', text: 'GeneRuler 1kb Plus DNA' },
            { payload: '2', text: 'GeneRuler 100 bp Plus DNA' },
        ];

        var fragmentsCount; //todo: change to dependency on the actual lines
        if (userEnzymeList.length == 0) {
            fragmentsCount = (
                <div className={styles.fragmentsNumLabel}>No digestion</div>
            );
        } else {
            fragmentsCount = (
                <div className={styles.fragmentsNumLabel}>{userEnzymeList.length + 1} fragments</div>
            );
        }

        var fragmentsLines = function () {
            var upperBoundary = currentGeneRuler[0];

            function sortNumber(a,b) {
                return a - b;
            }
            let ranges = [];
            for (let i = 0; i < cutsites.length; i++) {
                ranges.push(Math.abs(cutsites[i].end - cutsites[i].start));
            }
            ranges.sort(sortNumber);
            ranges.reverse();

            let yCount = 0;

            let lines = [];
            for (let iLeft = 0, iRight = 0; ; ) {
                if (iLeft == currentGeneRuler.length && iRight == ranges.length) {
                    break;
                } else if (iRight == ranges.length || currentGeneRuler[iLeft] >= ranges[iRight]) {
                    let offset = (upperBoundary - currentGeneRuler[iLeft]) / upperBoundary;
                    let offPix = offset.toFixed(2) * 500;
                    offPix = (offPix - yCount);
                    yCount += offPix;
                    offPix = offPix + "px";
                    lines.push((
                        <div>
                            <hr
                                className={styles.left}
                                style={{marginTop: offPix}}
                            />
                        </div>
                    ));
                    iLeft++;
                } else if (iLeft == currentGeneRuler.length || currentGeneRuler[iLeft] < ranges[iRight]) {
                    let offset = (upperBoundary - ranges[iRight]) / upperBoundary;
                    let offPix = offset.toFixed(2) * 500;
                    offPix = (offPix - yCount);
                    yCount += offPix;
                    offPix = offPix + "px";
                    lines.push((
                        <div>
                            <hr
                                className={styles.right}
                                style={{marginTop: offPix}}
                            />
                        </div>
                    ));
                    iRight++;
                }
            }
            return lines;
        };

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
                <Paper className={styles.block}>
                    {fragmentsLines()}
                </Paper>
            </div>
        );
    }
}
import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import SelectField from 'material-ui/lib/select-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import SaveIcon from 'material-ui/lib/svg-icons/content/save'
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import FEATURE_TYPES from './constants/feature-types';
import assign from 'lodash/object/assign';

import styles from './side-bar.css';

// this is the feature detail popout that comes out of the sidebar; it may need a new name
// or to be in a folder with sidebar stuff. This form is used to edit / add feature information

@Cerebral({
    showAddFeatureModal: ['showAddFeatureModal'],
})

export default class SidebarDetail extends React.Component {

    constructor(props) {
        super(props);

        // rows near the bottom should have the dropdown menu drop-up
        var rowHeight = 49.33; // probably shouldn't be hardcoded...
        var sidebarHeight = this.props.totalFeatures * rowHeight;
        var clientHeight = document.getElementById("tableContainer").clientHeight;
        var maxHeight = clientHeight > sidebarHeight ? clientHeight : sidebarHeight;
        var dropDownHeight = 315; // this is harcoded in sidebar.css (offset by 10 for padding), which i still feel bad about, but slightly less bad
        var dropUp = '';
        if (((this.props.rowPosition + 1) * rowHeight) + dropDownHeight > maxHeight && clientHeight > dropDownHeight) {
            dropUp = ((this.props.rowPosition+1) * rowHeight) - dropDownHeight;
        }

        this.state = {
            dropdown: "hidden",
            feature: assign({}, this.props.feature),
            featureTypes: FEATURE_TYPES,
            type: this.props.feature.type,
            dropUp: dropUp
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
    }

    save() {
        this.state.feature.type = this.state.type;
        this.props.editFeature(this.state.feature);
    };

    toggleDropDown(state) {
        if (state) {
            this.setState({dropdown: state});
        } else {
            this.state.dropdown === "hidden" ? this.setState({dropdown: "visible"}) : this.setState({dropdown: "hidden"});
        }
    }

    selectDropDown(event) {
        this.state.feature.type = event.target.innerHTML;
        this.state.feature.badType = false;
        this.setState({
            dropdown: "hidden",
            feature: this.state.feature,
            type: event.target.innerHTML
        });
    }

    filterList() {
        var string = this.refs.typeField.value;
        this.setState({ type: string });

        var regex = new RegExp('.*', 'i');
        if (string && string.length > 0) {
            var badType = true;
            try {
                regex = new RegExp(string.toLowerCase(), 'i');
            } catch (e) {
                return;
            }

            var filteredFeatureTypes = [];
            FEATURE_TYPES.forEach(function(type) {
                if (regex.test(type)) {
                    filteredFeatureTypes.push(type);
                }
                if (string.toLowerCase() === type.toLowerCase()) {
                    badType = false;
                }
            }.bind(this))
            this.state.feature.badType = badType;
            this.setState({ feature: this.state.feature, featureTypes: filteredFeatureTypes });
            if (filteredFeatureTypes.length < 11 && parseInt(this.state.dropUp)) {
                this.setState({ dropUp: ((this.props.rowPosition+1) * 49.33) - (30 * filteredFeatureTypes.length) + 15});
            } else if (parseInt(this.state.dropUp)) {
                this.setState({dropUp: ((this.props.rowPosition+1) * 49.33) - 315});
            }
        } else {
            this.setState({ featureTypes: FEATURE_TYPES });
        }
    }

    onChange = (event) => {
        this.state.feature[event.target.id] = event.target.value;
        this.setState({ feature: this.state.feature });
    };

    render() {
        var max = this.props.sequenceLength;

        var options = [];
        var rowStyle;
        for (var i=0; i<this.state.featureTypes.length; i++) {
            if (this.state.feature.type.toString().toLowerCase() === this.state.featureTypes[i].toLowerCase()) {
                rowStyle = "selectedType";
            } else {
                rowStyle = "unselectedType";
            }
            options.push(<ui className={styles[rowStyle]} value={this.state.featureTypes[i]}>{this.state.featureTypes[i]}</ui>);
        }

        return (
            <tr className={styles.editrow}>
                <td><input type="text"
                    id={"name"}
                    placeholder="name"
                    maxLength="50"
                    onChange={this.onChange.bind(this)}
                    value={this.state.feature.name.toString()}
                /></td>

                <td className={styles.selectInput}
                    hintText="type"
                    id={"type"}>
                    <input
                        ref="typeField"
                        type="text"
                        placeholder="type"
                        className={styles.typeValue}
                        value={this.state.type.toString()}
                        onClick={this.toggleDropDown.bind(this, "visible")}
                        onChange={this.filterList.bind(this)}
                        />
                    <IconButton style={{verticalAlign: 'middle', marginLeft: '-10px'}}
                        onClick={this.toggleDropDown.bind(this, false)}>
                        <ArrowDropDown/>
                    </IconButton>
                    <ul className={styles[this.state.dropdown]}
                        style={{top: this.state.dropUp+'px'}}
                        onClick={this.selectDropDown.bind(this)}>
                        {options}
                    </ul>
                </td>

                <td className={styles.position}>
                    <input type="number"
                    id={"start"}
                    placeholder="start"
                    onChange={this.onChange.bind(this)}
                    min="0" max={max}
                    value={this.state.feature.start.toString()}
                    />
                    <span>{' - '}</span>
                    <input type="number"
                    id={"end"}
                    placeholder="end"
                    onChange={this.onChange.bind(this)}
                    min="0" max={max}
                    value={this.state.feature.end.toString()}
                /></td>

                <td className={styles.strand}>
                    <input type="text"
                    id={"strand"}
                    placeholder="strand"
                    onChange={this.onChange.bind(this)}
                    pattern="-?1" required
                    value={this.state.feature.strand.toString()}
                /></td>
                <td>
                <IconButton
                    disabled={
                        !this.state.feature['start'] || isNaN(this.state.feature['start']) ||
                        this.state.feature['start'] < 1 || this.state.feature['start'] > max ||
                        !this.state.feature['end'] || isNaN(this.state.feature['end']) ||
                        this.state.feature['end'] < 1 || this.state.feature['end'] > max ||
                        !this.state.feature['strand'] || isNaN(this.state.feature['strand'] ||
                        this.state.feature['strand']*this.state.feature['strand'] !== 1)
                    }
                    onClick={this.save.bind(this)}
                    tooltip="save"
                    >
                    <SaveIcon/>
                </IconButton>
                </td>
            </tr>
        );
    }
}

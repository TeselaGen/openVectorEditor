import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import TextField from 'material-ui/lib/text-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import assign from 'lodash/object/assign';

import styles from './side-bar.css'
import FEATURE_TYPES from './constants/feature-types';

// this is the feature detail popout that comes out of the sidebar; it may need a new name
// or to be in a folder with sidebar stuff. This form is used to edit / add feature information

@Cerebral({
    showAddFeatureModal: ['showAddFeatureModal'],
})

export default class SidebarDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feature: assign({}, this.props.feature),
            style: {},
            dropdown: "hidden",
            featureTypes: FEATURE_TYPES,
            type: this.props.feature.type

        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
        this.state.style = {backgroundColor: 'white', position: 'relative', width: '350px', overflowY: 'visible'};
    }

    toggleDropDown(state) {
        if (state) {
            this.setState({dropdown: state});
        } else {
            this.state.dropdown === "hidden" ? this.setState({dropdown: "selectField"}) : this.setState({dropdown: "hidden"});
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
        this.props.createFeature(this.state.feature);
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
            })
            this.state.feature.type = string;
            this.state.feature.badType = badType;
            this.setState({ feature: this.state.feature, featureTypes: filteredFeatureTypes });
            this.props.createFeature(this.state.feature);
        } else {
            this.setState({ featureTypes: FEATURE_TYPES });
        }

    }

    onChange = (event) => {
        this.state.feature[event.target.id] = event.target.value;
        this.setState({ feature: this.state.feature });
        this.props.createFeature(this.state.feature);
    };

    render() {
        var {
            showAddFeatureModal,
            sequenceLength,
        } = this.props;

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
            <div style={this.state.style}>
                <TextField
                    id={"name"}
                    onChange={this.onChange.bind(this)}
                    floatingLabelText={"name"}
                    maxLength="50"
                    value={this.state.feature.name.toString()}
                    />
                <br/>

                <div
                    hintText="type"
                    onFocus={this.toggleDropDown.bind(this, "selectField")}
                    id={"type"}>
                    <input
                        ref="typeField"
                        type="text"
                        placeholder="type"
                        className={styles.typeValue}
                        value={this.state.type.toString()}
                        onChange={this.filterList.bind(this)}
                        />
                    <IconButton style={{verticalAlign: 'middle', marginLeft: '-10px'}}
                        onClick={this.toggleDropDown.bind(this, false)}>
                        <ArrowDropDown/>
                    </IconButton>
                    <ul className={styles[this.state.dropdown]}
                        onClick={this.selectDropDown.bind(this)}>
                        {options}
                    </ul>
                </div>

                <TextField
                    id={"start"}
                    onChange={this.onChange.bind(this)}
                    floatingLabelText={"start"}
                    errorText={
                        !this.state.feature.start && "not a number" ||
                        isNaN(this.state.feature.start) && "not a number" ||
                        this.state.feature.start < 1 && "cannot be less than 1" ||
                        this.state.feature.start > sequenceLength && "cannot exceed sequence length"
                    }
                    value={this.state.feature.start.toString()}
                    />
                <br/>

                <TextField
                    id={"end"}
                    onChange={this.onChange}
                    floatingLabelText={"end"}
                    errorText={
                        !this.state.feature.end && "not a number" ||
                        isNaN(this.state.feature.end) && "not a number" ||
                        this.state.feature.end < 1 && "cannot be less than 1" ||
                        this.state.feature.end > sequenceLength && "cannot exceed sequence length"
                    }
                    value={this.state.feature.end.toString()}
                    />
                <br/>

                <TextField
                    id={"strand"}
                    onChange={this.onChange.bind(this)}
                    floatingLabelText={"strand"}
                    errorText={
                        !this.state.feature.strand && "not a number" ||
                        isNaN(this.state.feature.strand) && "not a number" ||
                        this.state.feature.strand*this.state.feature.strand !== 1 && "must be 1 or -1"
                    }
                    value={this.state.feature.strand.toString()}
                    />
                <br/>
            </div>
        );
    }
}

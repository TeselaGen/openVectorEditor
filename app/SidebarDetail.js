import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import DropDownMenu from 'material-ui/lib/drop-down-menu';
import MenuItem from 'material-ui/lib/menu/menu-item';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import assign from 'lodash/object/assign';

// {{}} remove this.state and do it correctly

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
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
        this.state.style = {backgroundColor: 'white', position: 'relative', width: '350px', overflowY: 'scroll'};
    }

    onChange = (event) => {
        let target = event.target;
        while (!target.id) {
            //hacky workaround bc the individual dropdown menu items have no id
            target = target.parentElement;
        }
        this.state.feature[target.id] = event.target.value;
        this.setState({ feature: this.state.feature });
        this.props.createFeature(this.state.feature);
    };

    render() {
        var {
            showAddFeatureModal,
            sequenceLength,
        } = this.props;

        var FEATURE_TYPES = ["cds", "m_rna", "misc_binding", "misc_feature", "misc_marker", "promoter", "rep_origin", "terminator"];
        var options = [{ id: "type", payload: "", text: "" }];
        for (var i=0; i<FEATURE_TYPES.length; i++) {
            options.push({ id: "type", payload: FEATURE_TYPES[i], text: FEATURE_TYPES[i] });
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

                <SelectField
                    id={"type"}
                    onChange={this.onChange.bind(this)}
                    floatingLabelText={"type"}
                    // style={{maxHeight:"100px", overflowY:"scroll"}}
                    menuItems={options}
                    maxHeight={4}
                    value={this.state.feature.type.toString()}
                    />
                <br/>

                <TextField
                    id={"start"}
                    onChange={this.onChange.bind(this)}
                    floatingLabelText={"start"}
                    errorText={
                        !this.state.feature.start && "not a number" ||
                        isNaN(this.state.feature.start) && "not a number" ||
                        this.state.feature.start < 0 && "cannot be negative" ||
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
                        this.state.feature.end < 0 && "cannot be negative" ||
                        this.state.feature.end > sequenceLength && "cannot exceed sequence length" ||
                        this.state.feature.end === this.state.feature.start && "feature length cannot be zero"
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

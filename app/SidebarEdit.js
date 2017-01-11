import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import TextField from 'material-ui/lib/text-field';
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
            style: {}
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
        this.state.style = {backgroundColor: 'white', position: 'fixed', padding: '20px', marginLeft: '580px', width: '300px', border: '1px solid #ccc', zIndex: '55'};
    }

    save = () => {
        this.props.editFeature(this.state.feature);
    };

    onChange = (event) => {
        this.state.feature[event.target.id] = event.target.value;
        this.setState({
            feature: this.state.feature,
        });
    };

    render() {
        return (
            <tr>
                <td><TextField
                   id={"name"}
                   onChange={this.onChange}
                   value={this.state.feature.name.toString()}
                /></td>

                <td><TextField
                   id={"type"}
                   onChange={this.onChange}
                   value={this.state.feature.type.toString()}
                /></td>

                <td><TextField
                   id={"start"}
                   onChange={this.onChange}
                   errorText={isNaN(this.state.feature.start) && "not a number"}
                   value={this.state.feature.start.toString()}
                   />

                   <TextField
                   id={"end"}
                   onChange={this.onChange}
                   errorText={isNaN(this.state.feature.end) && "not a number"}
                   value={this.state.feature.end.toString()}
                /></td>

                <td><TextField
                   id={"strand"}
                   onChange={this.onChange}
                   errorText={isNaN(this.state.feature.strand) && "not a number"}
                   value={this.state.feature.strand.toString()}
                /></td>
                <td>
                    <br />
                    <button onClick={this.save}> Save Changes </button>
                </td>
            </tr>
        );
    }
}

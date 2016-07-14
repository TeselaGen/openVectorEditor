import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js';
import TextField from 'material-ui/lib/text-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import assign from 'lodash/object/assign';

// this is the feature detail popout that comes out of the sidebar; it may need a new name
// or to be in a folder with sidebar stuff. This form is used to edit / add feature information

export default class SidebarDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feature: assign({}, this.props.feature)
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
    }

    update() {
        // {{}} theres a better way to do this, willget to later
        clearTimeout(this.state.timeout);

        var timeout = setTimeout(() => {
            this.props.signals.updateFeature({
                feature: this.state.feature
            });
        }, 1000);

        this.setState({
            feature: this.state.feature,
            timeout: timeout
        });
    }

    onChange(event) {
        this.state.feature[event.target.id] = event.target.value;
        this.update();
    }

    render() {
        return (
            <div style={{backgroundColor: 'white', marginLeft: '580px', position: 'fixed', padding: '20px', width: '300px', border: '1px solid #ccc', zIndex: '55'}}>

              <TextField
                 id={"name"}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"name"}
                 value={this.state.feature.name.toString()}
                 />

              <br />

              <TextField
                 id={"type"}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"type"}
                 value={this.state.feature.type.toString()}
                 />

              <br />

              <TextField
                 id={"start"}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"start"}
                 errorText={isNaN(this.state.feature.start) && "not a number"}
                 value={this.state.feature.start.toString()}
                 />

              <br />

              <TextField
                 id={"end"}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"end"}
                 errorText={isNaN(this.state.feature.end) && "not a number"}
                 value={this.state.feature.end.toString()}
                 />

              <br />

              <TextField
                 id={"strand"}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"strand"}
                 errorText={isNaN(this.state.feature.strand) && "not a number"}
                 value={this.state.feature.strand.toString()}
                 />
                 
              <button onClick={this.onChange.bind(this)}> Save Changes </button>
            </div>
        );
    }
}

import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js';
import TextField from 'material-ui/lib/text-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import assign from 'lodash/object/assign';

@Cerebral({})

export default class FeatureForm extends React.Component {

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
            <div>
              <TextField
                 id={"id"}
                 disabled={true}
                 onChange={this.onChange.bind(this)}
                 floatingLabelText={"id"}
                 value={this.state.feature.id.toString()}
                 />

              <br />

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
            </div>
        );
    }
}

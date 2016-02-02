import React, { PropTypes } from 'react';

import { Decorator as Cerebral } from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js';

import TextField from 'material-ui/lib/text-field';

var assign = require('lodash/object/assign');

@Cerebral({})
export default class AnnotationForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            annotation: assign({}, this.props.annotation)
        };
    }

    onChange(event) {
        clearTimeout(this.state.timeout);

        var annotation = this.state.annotation;
        annotation[event.target.id] = event.target.value;

        var timeout = setTimeout(() => {
            this.props.signals.updateFeature({
                feature: annotation
            });
        }, 1000);

        this.setState({
            annotation: annotation,
            timeout: timeout
        });
    }

    render() {
        var fields = [];

        for ( let property in this.state.annotation ) {
            fields.push((<TextField onChange={this.onChange.bind(this)} disabled={property === 'id'} floatingLabelText={property} id={property} value={this.state.annotation[property]} />));
            fields.push((<br />));
        }

        return (
            <div>
              {fields}
            </div>
        );
    }

}

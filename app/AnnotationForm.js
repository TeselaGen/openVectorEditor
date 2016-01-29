import React, { PropTypes } from 'react';

import { Decorator as Cerebral } from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js';

import TextField from 'material-ui/lib/text-field';

export default class AnnotationForm extends React.Component {

    render() {
        var {
            annotation
        } = this.props;

        var fields = [];

        for ( let property in annotation ) {
            fields.push((<TextField floatingLabelText={property} value={annotation[property]} />));
            fields.push((<br />));
        }

        return (
            <div>
              {fields}
            </div>
        );
    }

}

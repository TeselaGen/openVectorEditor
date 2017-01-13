import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import TextField from 'material-ui/lib/text-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import SaveIcon from 'material-ui/lib/svg-icons/content/save'
import assign from 'lodash/object/assign';

import styles from './side-bar.css';


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
        };

        if (this.state.feature.notes === undefined) {
            this.state.feature.notes = [];
        } else {
            this.state.feature.notes = this.props.feature.notes.slice();
        }
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
            <tr className={styles.editrow}>
                <td><input type="text"
                    id={"name"}
                    placeholder="name"
                    onChange={this.onChange}
                    value={this.state.feature.name.toString()}
                /></td>

                <td><input type="text"
                    id={"type"}
                    placeholder="type"
                    onChange={this.onChange}
                    value={this.state.feature.type.toString()}
                /></td>

                <td className={styles.position}>
                    <input type="text"
                    id={"start"}
                    placeholder="start"
                    onChange={this.onChange}
                    pattern="\d+" required
                    value={this.state.feature.start.toString()}
                    />
                    <span>{' - '}</span>
                    <input type="text"
                    id={"end"}
                    placeholder="end"
                    onChange={this.onChange}
                    pattern="\d+" required
                    value={this.state.feature.end.toString()}
                /></td>

                <td className={styles.strand}>
                    <input type="text"
                    id={"strand"}
                    placeholder="strand"
                    onChange={this.onChange}
                    errorText={isNaN(this.state.feature.strand) && "not a number"}
                    value={this.state.feature.strand.toString()}
                /></td>
                <td style={{textAlign: 'center'}}>
                    <SaveIcon className={styles.saveButton} style={{fill: '#00bcd4'}} onClick={this.save}/>
                </td>
            </tr>
        );
    }
}

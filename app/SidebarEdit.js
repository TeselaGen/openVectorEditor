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
            feature: assign({}, this.props.feature)
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
        this.setState({ feature: this.state.feature });
    };

    render() {
        var max = this.props.sequenceLength;
        
        var FEATURE_TYPES = ["promoter", "terminator", "cds", "misc_feature", "m_rna", "misc_binding", "misc_marker", "rep_origin"];
        var options = [];
        for (var i=0; i<FEATURE_TYPES.length; i++) {
            options.push(<option value={FEATURE_TYPES[i]}>{FEATURE_TYPES[i]}</option>);
        }

        return (
            <tr className={styles.editrow}>
                <td><input type="text"
                    id={"name"}
                    placeholder="name"
                    maxLength="50"
                    onChange={this.onChange}
                    value={this.state.feature.name.toString()}
                /></td>

                <td><select name="type"
                    id={"type"}
                    placeholder="type"
                    onChange={this.onChange}
                    value={this.state.feature.type.toString()}>
                    {options}
                </select></td>

                <td className={styles.position}>
                    <input type="number"
                    id={"start"}
                    placeholder="start"
                    onChange={this.onChange}
                    min="0" max={max}
                    value={this.state.feature.start.toString()}
                    />
                    <span>{' - '}</span>
                    <input type="number"
                    id={"end"}
                    placeholder="end"
                    onChange={this.onChange}
                    min="0" max={max}
                    value={this.state.feature.end.toString()}
                /></td>

                <td className={styles.strand}>
                    <input type="text"
                    id={"strand"}
                    placeholder="strand"
                    onChange={this.onChange}
                    pattern="-?1" required
                    value={this.state.feature.strand.toString()}
                /></td>
                <td>
                <IconButton
                    disabled={
                        !this.state.feature['start'] || isNaN(this.state.feature['start']) ||
                        this.state.feature['start'] < 0 || this.state.feature['start'] > max ||
                        !this.state.feature['end'] || isNaN(this.state.feature['end']) ||
                        this.state.feature['end'] < 0 || this.state.feature['end'] > max ||
                        !this.state.feature['strand'] || isNaN(this.state.feature['strand'] ||
                        this.state.feature['strand']*this.state.feature['strand'] !== 1)
                    }
                    onClick={this.save}
                    tooltip="save"
                    >
                    <SaveIcon/>
                </IconButton>
                </td>
            </tr>
        );
    }
}

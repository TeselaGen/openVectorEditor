import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import SelectField from 'material-ui/lib/select-field';
import AddBoxIcon from 'material-ui/lib/svg-icons/content/add-box';
import IndeterminateCheckBoxIcon from 'material-ui/lib/svg-icons/toggle/indeterminate-check-box';
import IconButton from 'material-ui/lib/icon-button';
import SaveIcon from 'material-ui/lib/svg-icons/content/save'
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import assign from 'lodash/object/assign';

import styles from './side-bar.css';
var FEATURE_TYPES = [
    "-10_signal",
    "-35_signal",
    "3'UTR",
    "5'UTR",
    "allele",
    "attenuator",
    "C_region",
    "CAAT_signal",
    "CDS",
    "conflict",
    "D_segment",
    "D-loop",
    "enhancer",
    "exon",
    "GC_signal",
    "gene",
    "iDNA",
    "intron",
    "J_region",
    "LTR",
    "mat_peptide",
    "misc_binding",
    "misc_difference",
    "misc_feature",
    "misc_recomb",
    "misc_RNA",
    "misc_signal",
    "misc_structure",
    "modified_base",
    "mRNA",
    "mutation",
    "N_region",
    "old_sequence",
    "polyA_signal",
    "polyA_site",
    "precursor_RNA",
    "prim_transcript",
    "primer",
    "primer_bind",
    "promoter",
    "protein_bind",
    "RBS",
    "rep_origin",
    "repeat_region",
    "repeat_unit",
    "rRNA",
    "S_region",
    "satellite",
    "scRNA",
    "sig_peptide",
    "snRNA",
    "source",
    "stem_loop",
    "STS",
    "TATA_signal",
    "terminator",
    "transit_peptide",
    "transposon",
    "tRNA",
    "unsure",
    "V_region",
    "variation"
];

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
            dropdown: "hidden"
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

    toggleDropDown() {
        this.state.dropdown === "hidden" ? this.setState({dropdown: "visible"}) : this.setState({dropdown: "hidden"});
    }

    selectDropDown(event) {
        this.state.feature["type"] = event.target.innerHTML;
        this.setState({
            dropdown: "hidden",
            feature: this.state.feature
        });
    }

    onChange = (event) => {
        this.state.feature[event.target.id] = event.target.value;
        this.setState({ feature: this.state.feature });
    };

    render() {
        var max = this.props.sequenceLength;

        var options = [];
        var rowStyle;
        for (var i=0; i<FEATURE_TYPES.length; i++) {
            if (this.state.feature.type.toString().toLowerCase() === FEATURE_TYPES[i].toLowerCase()) {
                rowStyle = "selectedType";
            } else {
                rowStyle = "unselectedType";
            }
            options.push(<ui className={styles[rowStyle]} value={FEATURE_TYPES[i]}>{FEATURE_TYPES[i]}</ui>);
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
                    id={"type"}
                    onClick={this.toggleDropDown.bind(this)}>
                    <div className={styles.typeValue}>{this.state.feature.type.toString()}</div>
                    <IconButton style={{verticalAlign: 'middle', marginLeft: '-10px'}}>
                        <ArrowDropDown/>
                    </IconButton>
                    <ul className={styles[this.state.dropdown]}
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
                        this.state.feature['start'] < 0 || this.state.feature['start'] > max ||
                        !this.state.feature['end'] || isNaN(this.state.feature['end']) ||
                        this.state.feature['end'] < 0 || this.state.feature['end'] > max ||
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

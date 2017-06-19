import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
var assign = require('lodash/object/assign');

import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import Toggle from 'material-ui/lib/toggle';
import IconButton from 'material-ui/lib/icon-button';
import ArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-left';

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    searchLayers: ['searchLayers'],
    showSearchBar: ['showSearchBar'],
    searchString: ['searchString'],
})

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchIdx: 0,
            dna: "DNA",
            literal: "Literal",
        };
    }

    componentWillReceiveProps(newProps) {
        // new/different search results
        if (newProps.searchLayers !== this.props.searchLayers && newProps.searchLayers.length > 0) {
            var row = Math.floor((newProps.searchLayers[0].start-1)/(this.props.bpsPerRow));
            row = row <= 0 ? "0" : row;
            this.props.signals.jumpToRow({rowToJumpTo: row});

            var layer = Object.assign({}, newProps.searchLayers[0]);
            layer.selected = true;
            this.props.signals.setSelectionLayer({ selectionLayer: layer });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // navigating through search results
        if (this.state.searchIdx !== prevState.searchIdx && this.props.searchLayers.length > 0) {
            var row = Math.floor((this.props.searchLayers[this.state.searchIdx-1].start-1)/(this.props.bpsPerRow));
            row = row <= 0 ? "0" : row;
            this.props.signals.jumpToRow({rowToJumpTo: row});

            var layer = Object.assign({}, this.props.searchLayers[this.state.searchIdx-1]);
            layer.selected = true;
            this.props.signals.setSelectionLayer({ selectionLayer: layer });
        }
    }

    search() {
        var string = this.refs.searchField.getValue();
        this.setState({ searchIdx: 1 });
        this.props.signals.searchSequence({
            searchString: string,
            dna: this.state.dna,
            literal: this.state.literal
        });
    }

    clearSearch() {
        this.refs.searchField.setValue("");
        this.props.signals.searchSequence({
            searchString: "",
            dna: this.state.dna,
            literal: this.state.literal
        });
    }

    selectField(event) {
        // dna/amino acids and literal/ambiguous dropdown boxes
        var dna = this.state.dna;
        var literal = this.state.literal;
        var newValue = event.target.firstChild.data;

        if (newValue === "DNA" || newValue === "Amino Acids") {
            dna = newValue;
            this.setState({ dna: newValue });
        } else {
            literal = newValue;
            this.setState({ literal: newValue });
        }

        // rerun search if search params are changed
        // (state is updating asynchronously, so I can't use this.state in this fn call)
        this.setState({ searchIdx: 1 });
        this.props.signals.searchSequence({
            searchString: this.refs.searchField.getValue(),
            dna: dna,
            literal: literal
        });
    }

    prevResult() {
        var searchLayers = this.props.searchLayers;
        var prevIdx = this.state.searchIdx - 1;
        if (prevIdx === 0) {
            prevIdx = searchLayers.length;
        }
        this.setState({ searchIdx: prevIdx });
    }

    nextResult() {
        var searchLayers = this.props.searchLayers;
        var nextIdx = this.state.searchIdx + 1;
        if (nextIdx === searchLayers.length + 1) {
            nextIdx = 1;
        }
        this.setState({ searchIdx: nextIdx });
    }

    render() {
        var {
            searchLayers,
            signals,
            showSearchBar,
            searchString,
        } = this.props;

        if (!showSearchBar) {
            return(<div style={{display: 'none'}}></div>);
        }

        // results navigation pane
        var navigateSearchResults;
        if (searchLayers.length > 0) {
            navigateSearchResults = (
                <div style={{display:'inline-block', marginRight:'10px', width:'150px', verticalAlign:'middle'}}>

                    <div style={{display: 'inline-block', fontStyle: 'italic', fontSize: '9pt'}}>
                        {this.state.searchIdx} of {searchLayers.length}
                    </div>

                    <IconButton
                        style={{display: 'inline-block', top: '10px'}}
                        label="previous"
                        tooltip="previous"
                        onClick={this.prevResult.bind(this)}>
                        <ArrowLeft style={{height: '12px', width: '12px'}}/>
                    </IconButton>

                    <IconButton
                        style={{display: 'inline-block', top: '10px', left: '-15px'}}
                        label="next"
                        tooltip="next"
                        onClick={this.nextResult.bind(this)}>
                        <ArrowRight style={{height: '12px', width: '12px'}}/>
                    </IconButton>

                </div>
            );
        } else {
            navigateSearchResults = (<div style={{display:'inline-block', marginRight:'10px'}}></div>);
        }

        // dna/amino acids dropdown box
        var dnaDropdown = (
            <SelectField
                style={{display:'inline-block', marginRight:'10px', width:'130px', verticalAlign:'middle'}}
                id={"dnaDropdown"}
                onChange={this.selectField.bind(this)}
                menuItems={[
                    { payload: "DNA", text: <div>DNA</div> },
                    { payload: "Amino Acids", text: <div>Amino Acids</div> }
                ]}
            />
        );

        // literal/ambiguous dropdown box
        var literalDropdown = (
            <SelectField
                style={{display:'inline-block', marginRight:'10px', width:'130px', verticalAlign:'middle'}}
                id={"literalDropdown"}
                onChange={this.selectField.bind(this)}
                menuItems={[
                    { payload: "Literal", text: <div>Literal</div> },
                    { payload: "Ambiguous", text: <div>Ambiguous</div> }
                ]}
            />
        );

        return (
            <div
                ref="searchBar"
                style={{position:'absolute', zIndex:'10', width:'1000px', left:'20px'}}>
                <div
                    style={{position:'absolute', top:'13px', left:'-20px', cursor:'pointer', fontSize:'13pt'}}
                    onClick={this.clearSearch.bind(this)}>
                    x
                </div>
                <TextField ref="searchField" hintText="search sequence"
                    style={{marginRight:'10px', width:'150px', verticalAlign:'middle'}}
                    onChange={this.search.bind(this)}
                    errorText={
                        searchLayers.length === 0 && searchString.length > 0 && "no results"
                    }
                    />
                { navigateSearchResults }
                { dnaDropdown }
                { literalDropdown }
            </div>
        );

    }
}

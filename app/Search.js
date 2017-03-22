import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import IconButton from 'material-ui/lib/icon-button';
import ArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import ArrowLeft from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-left';
// import Cancel from 'material-ui/lib/svg-icons/navigation/cancel';

@Cerebral({
    searchLayers: ['searchLayers'],
    selectionLayer: ['selectionLayer'],
    showSearchBar: ['showSearchBar'],
    searchString: ['searchString']
})

export default class Search extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            searchIdx: 1,
            dna: "DNA",
            literal: "Literal"
        };
    }

    search() {
        this.setState({ searchIdx: 1 });
        this.props.signals.searchSequence({
            searchString: this.refs.searchField.getValue(),
            dna: this.state.dna,
            literal: this.state.literal
        });
    }

    selectField(event) {
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
        // state is updating concurrently, so I can't use this.state in this fn call
        if (this.refs.searchField.getValue().length > 0) {
            this.props.signals.searchSequence({
                searchString: this.refs.searchField.getValue(),
                dna: dna,
                literal: literal
            });
        }
    }

    prevResult() {
        var searchLayers = this.props.searchLayers;
        var prevIdx = this.state.searchIdx - 1;
        if (prevIdx === 0) {
            prevIdx = searchLayers.length;
        }
        this.setState({ searchIdx: prevIdx });
        this.props.signals.setSelectionLayer({ selectionLayer: searchLayers[prevIdx-1] }) // convert 1-indexed to 0-indexed
    }

    nextResult() {
        var searchLayers = this.props.searchLayers;
        var nextIdx = this.state.searchIdx + 1;
        if (nextIdx === searchLayers.length + 1) {
            nextIdx = 1;
        }
        this.setState({ searchIdx: nextIdx });
        this.props.signals.setSelectionLayer({ selectionLayer: searchLayers[nextIdx-1] }) // convert 1-indexed to 0-indexed
    }

    render() {
        var {
            searchLayers,
            selectionLayer,
            signals,
            showSearchBar,
            searchString
        } = this.props;

        if (!showSearchBar) {
            return(<div style={{display: 'none'}}></div>);
        }

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
                style={{position:'absolute', zIndex:'10', width:'1000px'}}>
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

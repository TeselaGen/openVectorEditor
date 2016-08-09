import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

const Dialog = require('material-ui/lib/dialog');
// import Dialog from 'material-ui/lib/dialog';

@Cerebral({
    showRestrictionEnzymeManager: ['showRestrictionEnzymeManager'],
    readOnly: ['readOnly'],
})

export default class RestrictionEnzymeManager extends  React.Component {

    constructor () {
        super();
        this.closeModal = this.closeModal.bind(this);
    }

    state = {
        open: true,
    };

    returnState () {
        console.log(this.state.open);
        console.log(this.state.isOpen);
        return this.state.isOpen;
    }

    openDialog () {this.setState({open: true});};

    closeDialog () { this.setState({open: false}); };

    render () {
        return (
            <div>
                <Dialog
                    isOpen={this.returnState}
                    onRequestClose={this.closeModal}
                    >
                    <h1>Close Me With Escape Modal</h1>
                    <button onClick={this.closeDialog}>Close</button>
                </Dialog>
            </div>
        );
    }
}
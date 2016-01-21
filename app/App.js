var ac = require('ve-api-check');
import controller from './cerebral/controller.js';
import React from 'react';
import {Container} from 'cerebral-view-react';
import SequenceEditor from './SequenceEditor.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

module.exports = function (options) {
	ac.throw(ac.shape({
		state: ac.object,
		actions: ac.object
	}),options)
	var cerebral = controller(options)
	return {
		Editor: (<Container controller={cerebral}>
		    <SequenceEditor/>
		  </Container>),
		controller: cerebral
	};
}

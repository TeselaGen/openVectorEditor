	var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');
var ac = require('ve-api-check');
import controller from './controller.js';
import React from 'react';
import {Container} from 'cerebral-react';
import SequenceEditor from './SequenceEditor.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

module.exports = function (options) {
	ac.throw(ac.shape({
		state: ac.object,
		actions: ac.object
	}),options)
	//tidy up the sequence data so it will work in our app
	options.state.sequenceData = tidyUpSequenceData(options.state.sequenceData)
	
	var cerebral = controller(options);
	return {
		Editor: (<Container controller={cerebral} app={SequenceEditor}/>),
		controller: cerebral
	};
}

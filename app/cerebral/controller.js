import Controller from 'cerebral';
import Model from 'cerebral-baobab';
import signals from './signals';
import defaultState from './state';
import assign from 'lodash/object/assign'
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');


export default function (options={state: null, services: null, actions: null}) {
	//merge all optional state into the default state
	var newDefaultState = assign({},defaultState, options.state);
	//tidy up the sequence data so it will work in our app
	newDefaultState.sequenceData = tidyUpSequenceData(newDefaultState.sequenceData)

	//tnr: we can pass extra baobab-specific options here as well if we want
	const model = Model(newDefaultState); 
	
	//tnr: services are things like an ajax library, or some default values that we want every action to have access to
	const services = {};
	//create the controller
	var controller = Controller(model, services);
	//and attach signals to it
	signals(controller, options);
	return controller;
}

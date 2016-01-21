import Controller from 'cerebral';
import Model from 'cerebral-model-baobab';
import signals from './signals';
import defaultState from './state';
import assign from 'lodash/object/assign'
var tidyUpSequenceData = require('ve-sequence-utils/tidyUpSequenceData');


export default function(options = {
    state: null,
    services: null,
    actions: null
}) {
    //merge all optional state into the default state
    var newDefaultState = assign({}, defaultState, options.state);
    //tidy up the sequence data so it will work in our app
    newDefaultState.sequenceData = tidyUpSequenceData(newDefaultState.sequenceData)

    //tnr: we can pass extra baobab-specific options here as well if we want
    const model = Model(newDefaultState, {lazyMonkeys: false});
    //create the controller
    var controller = Controller(model);
    // only when testing - expose the model on the controller
    // (webpack will make process.env.NODE_ENV available).
    if (process.env.NODE_ENV === 'testing') {
        // DON'T DO THIS IN PRODUCTION
        controller.model = model;
        controller.state = model.tree;

        // optional test helper to rest cerebral state, you may want to put this
        // somewhere else if don't like test methods being deployed to production.
        controller.reset = function() {
            model.tree.set(newDefaultState);
            model.tree.commit();
        };
    }
    //and attach signals to it
    controller.signals(signals(options));
    return controller;
}
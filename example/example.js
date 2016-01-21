// var sequenceData1 = require('.exampleData/sequenceData');
// var sequenceData = require('.exampleData/sequenceDataWithOrfsAndTranslations');
// var sequenceData = require('.exampleData/sequenceDataWithOrfsAndTranslations2');
var sequenceData = require('../exampleData/sequenceDataWithOrfsAndTranslations3');
var ReactDOM = require('react-dom')
var App = require('../app/App.js')
// import request from 'superagent'

//set your custom options here
var options = {
	state: {
		//override default state here. See state.js for the full list of application state
		sequenceData: sequenceData //tnr: set the initial sequence data here
		// showFeatures: true,
		//etc..
	},
	services: {
		//add or override any services you want here. These are passed to every action (see below)
		// request: request
	},
	actions: {
		//override default actions here. See signals.js for the full list of application signals
		saveSequence: function saveSequence ({input, output, services}) {
			services.request.post('/sequence')
				.send(input.sequenceData)
				.then(function (res) {
					output.success(res.body)
				}).catch(function (err) {
					output.error(err)
				})
		}
	},
}

//Editor is the React Component
//controller is the cerebral state controller
var {Editor, controller} = App(options);
//choose the dom node you want to render to
const DOMNodeToRenderTo = document.createElement('div');
document.body.appendChild(DOMNodeToRenderTo);
ReactDOM.render(Editor, DOMNodeToRenderTo);

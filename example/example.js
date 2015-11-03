import ReactDOM from 'react-dom';
import App from '../app/App.js'
// import request from 'superagent'

//set your custom options here
var options = {
	state: {
		//override default state here. See state.js for the full list of application state
		// showFeatures: true,
		//etc..
	},
	services: {
		//add or override any services you want here. These are passed to every action (see below)
		// request: request
	},
	actions: {
		//override default actions here. See signals.js for the full list of application signals
		saveSequence: function saveSequence (input, tree, output, services) {
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

var {Editor, controller} = App(options);
//Editor is the React Component
//controller is the cerebral state controller


//choose the dom node you want to render to
const DOMNodeToRenderTo = document.createElement('div');
document.body.appendChild(DOMNodeToRenderTo);
ReactDOM.render(Editor, DOMNodeToRenderTo);

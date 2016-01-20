
#openVectorEditor
##An open source vector/plasmid/dna editor

###Project Info: https://workflowy.com/s/AMpvp1km0o

Chatroom: [![Join the chat at https://gitter.im/TeselaGen/openVectorEditor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/TeselaGen/openVectorEditor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Issue Tracking: [![Stories in Ready](https://badge.waffle.io/TeselaGen/openVectorEditor.png?label=ready&title=Ready)](https://waffle.io/TeselaGen/openVectorEditor)

Google hangout [link](https://hangouts.google.com/call/jhgq63wgvimabmjjct5526dnl4a)

See a [demo] (http://teselagen.github.io/openVectorEditor/)



###Embedding into your own project (Work In Progress)

```js
import ReactDOM from 'react-dom';
import App from 'open-vector-editor'
import request from 'superagent'

//set your custom options here
var options = {
	state: {
		//override default state here. See state.js for the full list of application state
		showFeatures: true,
		//etc..
	},
	services: {
		//add or override any services you want here. These are passed to every action (see below)
		request: request
	},
	actions: {
		//override default actions here. See signals.js for the full list of application signals
		saveSequence: function saveSequence ({input, state, output}, services) {
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

```


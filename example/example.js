// var sequenceData1 = require('.exampleData/sequenceData');
// var sequenceData = require('.exampleData/sequenceDataWithOrfsAndTranslations');
// var sequenceData = require('.exampleData/sequenceDataWithOrfsAndTranslations2');
// var sequenceData = require('../exampleData/sequenceDataWithOrfsAndTranslations3');
var ReactDOM = require('react-dom')
var App = require('../app/App.js')
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

var getSequence = "";
var name = "";
var fullBody;

request
    .get('/rest/parts/' + id + '/sequence')
    .set('X-ICE-Authentication-sessionId', sid)
    .accept('application/json')
    .end(function(err, result) {
        getSequence = result.body.sequence;
        name = result.body.name;
        fullBody = result.body;
    });

console.log("response: " + fullBody);
console.log("sequence: " + getSequence);
console.log("name: " + name);

//set your custom options here
var options = {
	state: {
		//override default state here. See state.js for the full list of application state
		// sequenceData: getSequence,
        // circular: isCircular,
        // name: name
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

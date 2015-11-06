import ReactDOM from 'react-dom';
import App from './App'
var sequenceDataWithOrfsAndTranslations3 = require('../exampleData/sequenceDataWithOrfsAndTranslations3');

var options = {
	actions: {

	},
	state: {
		sequenceData: sequenceDataWithOrfsAndTranslations3 
	}
}

var {Editor, controller} = App(options);

const DOMNodeToRenderTo = document.createElement('div');
document.body.appendChild(DOMNodeToRenderTo);
ReactDOM.render(Editor, DOMNodeToRenderTo);

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

it('should render the app without errors', function (done) {
	this.timeout(5000) //add a slightly longer mocha timout than normal for this test
	const DOMNodeToRenderTo = document.createElement('div');
	document.body.appendChild(DOMNodeToRenderTo);
	ReactDOM.render(Editor, DOMNodeToRenderTo);
	done()
});
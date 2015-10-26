import ReactDOM from 'react-dom';
import App from './App'

var options = {
	actions: {

	},
	state: {
		showFeatures: false

	}
}

var {Editor, controller} = App(options);

const DOMNodeToRenderTo = document.createElement('div');
document.body.appendChild(DOMNodeToRenderTo);
ReactDOM.render(Editor, DOMNodeToRenderTo);

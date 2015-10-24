import ReactDOM from 'react-dom';
import {controller, editor} from './App'

//do overrides here:

//merge in custon state data before it is rendered
//

controller.merge({
	showFeatures: false,
	sequenceData: mySequenceData
})

//override actions here: 

controller.actions.merge({
	saveSequence: function mySpecialSequenceSave (input, tree, output, services) {
		services.request.post('/sequences').send(input.sequenceData)
	}
})

//render to wherever you want here!

const app = document.createElement('div');
document.body.appendChild(app);
ReactDOM.render(editor, app);

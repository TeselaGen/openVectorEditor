import controller from './controller.js';
import React from 'react';
import {Container} from 'cerebral-react';
import SequenceEditor from './SequenceEditor.js';

const app = document.createElement('div');
document.body.appendChild(app);

React.render(<Container controller={controller} app={SequenceEditor}/>, app);

//tnrtodo: add back this functionality to watch for before unload
// window.addEventListener('beforeunload', function(e) {
//  var confirmationMessage = 'It looks like you have been editing something.';
//  confirmationMessage += 'If you leave before saving, your changes will be lost.';

//  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
// });
import controller from './controller.js';
import {Container} from 'cerebral-react';
import ReactDOM from 'react-dom';
import React from 'react';
import SequenceEditor from './SequenceEditor.js';

ReactDOM.render(
  <Container controller={controller}>
    <SequenceEditor/>
  </Container>
, document.querySelector('#mount-point'));

//tnrtodo: add back this functionality to watch for before unload
// window.addEventListener('beforeunload', function(e) {
//  var confirmationMessage = 'It looks like you have been editing something.';
//  confirmationMessage += 'If you leave before saving, your changes will be lost.';

//  (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//  return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
// });
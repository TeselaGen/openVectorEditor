import controller from './controller.js';
import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'cerebral-react';
import SequenceEditor from './SequenceEditor.js';

const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render(<Container controller={controller} app={SequenceEditor}/>, app);

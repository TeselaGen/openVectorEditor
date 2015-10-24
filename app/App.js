import controller from './controller.js';
import React from 'react';
import {Container} from 'cerebral-react';
import SequenceEditor from './SequenceEditor.js';

module.exports = {
	editor: (<Container controller={controller} app={SequenceEditor}/>), 
	controller
};
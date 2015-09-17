
var React = require('react');
var SequenceEditor = require('./SequenceEditor');

var baobabMixin = require('baobab-react/mixins').root;
var baobabTree = require('./baobabTree');

// window.addEventListener('beforeunload', function(e) {
// 	var confirmationMessage = 'It looks like you have been editing something.';
// 	confirmationMessage += 'If you leave before saving, your changes will be lost.';

// 	(e || window.event).returnValue = confirmationMessage; //Gecko + IE
// 	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
// });
var OnUnload = require("react-window-mixins").OnUnload;
var App = React.createClass({

  mixins: [baobabMixin, OnUnload],
  
  //tnrtodo: add back this functionality to watch for before unload
 //  onBeforeUnload: function(e) {
 //    var confirmationMessage = 'It looks like you have been editing something.';
	// confirmationMessage += 'If you leave before saving, your changes will be lost.';

	// (e || window.event).returnValue = confirmationMessage; //Gecko + IE
	// return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
 //  },

  render: function () {
    return (
        <SequenceEditor/>
    );
  }
});

React.render(<App tree={baobabTree}/>, document.getElementById('mount-point'));

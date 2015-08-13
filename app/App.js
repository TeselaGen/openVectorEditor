var React = require('react');
var SequenceEditor = require('./SequenceEditor');

var baobabMixin = require('baobab-react/mixins').root;
var baobabTree = require('./baobabTree');
window.addEventListener('beforeunload', function() {
  console.log('onBeforeUnload hit!');
  return 'Are you sure you want to leave the page?';
});

var App = React.createClass({

  mixins: [baobabMixin],
  //tnrtodo: add functionality to watch for before unload

  render: function () {
    return (
        <SequenceEditor/>
    );
  }
});

React.render(<App tree={baobabTree}/>, document.getElementById('mount-point'));

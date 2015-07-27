var React = require('react');
var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Dashboard = require('./Dashboard.js');
// var SequenceLibrary = require('./SequenceLibrary.js');
var SequenceEditor = require('./SequenceEditor.js');
// var SequenceEditor3 = require('./SequenceEditor3.js');
// var Skeleton = require('./Skeleton.js');

var Login = require('./Login.js');
var Logout = require('./Logout.js');
var Authentication = require('./Authentication.js');
// var About = require('./About.js');
// var auth = require('./auth.js');

// var baobabMixin = require('baobab-react/mixins').root;
// var baobabTree = require('./baobabTree');
var mixin = require('baobab-react/mixins').branch;

// var RowItem = React.createClass({


var Skeleton = React.createClass({
  mixins: [mixin, Authentication],

  cursors: {
    sequencesMegaStore: ['sequencesMegaStore'],
    // sequenceData: ['vectorEditorState', 'sequenceData'],
    // selectionLayer: ['vectorEditorState', 'selectionLayer'],
    // mouse: ['vectorEditorState', 'mouse'],
    // caretPosition: ['vectorEditorState', 'caretPosition'],
  },


  // contextTypes: {
  //   router: React.PropTypes.func.isRequired
  // },

  // getInitialState: function () {
  //   return {
  //     loggedIn: auth.loggedIn()
  //   };
  // },

  // setStateOnAuth: function (loggedIn) {
  //   this.setState({
  //     loggedIn: loggedIn
  //   });
  // },

  // componentWillMount: function () {
  //   auth.onChange = this.setStateOnAuth;
  //   auth.login();
  // },

  render: function () {
  // console.log(this.state.sequencesMegaStore);
    return (
      <div>
        <header>
          <ul>
            <li><Link to="sequences">My Sequences</Link></li>
            <li><Link to="sequences">My Oligos</Link></li>
            <li><Link to="sequences">My Parts</Link></li>
            <li><Link to="sequences">My Designs</Link></li>
            <li><Link to="sequences">My Designs</Link></li>
            <li><Link to="SequenceEditor">SequenceEditor</Link></li>
            <li><Link to="SequenceEditor3">SequenceEditor3</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});
        // {this.state.sequencesMegaStore}

module.exports = Skeleton;
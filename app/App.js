var React = require('react');
var Router = require('react-router'); // or var Router = ReactRouter; in browsers
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Dashboard = require('./Dashboard.js');
// var SequenceLibrary = require('./SequenceLibrary.js');
var SequenceEditor = require('./SequenceEditor.js');
var Skeleton = require('./Skeleton.js');

var Login = require('./Login.js');
var Logout = require('./Logout.js');
var Authentication = require('./Authentication.js');
var About = require('./About.js');
var auth = require('./auth.js');

var baobabMixin = require('baobab-react/mixins').root;
var baobabTree = require('./baobabTree');

var App = React.createClass({

  mixins: [baobabMixin],

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      loggedIn: auth.loggedIn()
    };
  },

  setStateOnAuth: function (loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function () {
    auth.onChange = this.setStateOnAuth;
    auth.login();
  },

  render: function () {
    var loginOrOut = this.state.loggedIn ?
      <Link to="logout">Log out</Link> :
      <Link to="login">Sign in</Link>;
    return (
      <div>
        <SequenceEditor/>
        <header>
          <ul>
            <li>{loginOrOut}</li>
            <li><Link to="about">About</Link></li>
            <li><Link to="dashboard">Dashboard</Link></li>
          </ul>
        </header>
        <RouteHandler/>
      </div>
    );
  }
});
            // <li><Link to="about">About</Link></li>
            // <li><Link to="dashboard">Dashboard</Link></li>
            // <li><Link to="sequences">Sequences</Link></li>
            // <li><Link to="SequenceEditor">SequenceEditor5</Link></li>

var routes = (
  <Route handler={App}>
    <Route path="/login" name="login" handler={Login}/>
    <Route path="/logout" name="logout" handler={Logout}/>
    <Route path="/about" name="about" handler={About}/>

    <Route path="" name="Skeleton" handler={Skeleton}>
      <Route path="/dashboard" name="dashboard" handler={Dashboard}/>
      <Route path="/SequenceEditor" name="SequenceEditor" handler={SequenceEditor}/>
    </Route>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler tree={baobabTree}/>, document.body);
});

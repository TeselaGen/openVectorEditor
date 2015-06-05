var React = require('react');
var auth = require('./auth.js');

var Login = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      error: false
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var router = this.context.router;
    var nextPath = router.getCurrentQuery().nextPath;
    var email = this.refs.email.getDOMNode().value;
    var pass = this.refs.pass.getDOMNode().value;
    auth.login(email, pass, function (loggedIn) {
      if (!loggedIn)
        return this.setState({ error: true });

      if (nextPath) {
        router.replaceWith(nextPath);
      } else {
        router.replaceWith('/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p>Bad login information</p> : '';
    return (
      <form onSubmit={this.handleSubmit}>
        <label><input ref="email" placeholder="email" defaultValue="joe@example.com"/></label>
        <label><input ref="pass" placeholder="password"/></label> (hint: password1)<br/>
        <button type="submit">login</button>
        {errors}
      </form>
    );
  }
});

module.exports = Login;
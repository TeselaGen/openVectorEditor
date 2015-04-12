var React = require('react');
var Authentication = require('./Authentication.js');
var auth = require('./auth.js');


var Dashboard = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    var token = auth.getToken();
    return (
      <div>
        Dashboard
        <div>
            Designs
        </div>
        <div>
            Parts
        </div>
        <div>
            Sequences
        </div>
        <div>
            Strains
        </div>
        <p>{token}</p>
      </div>
      
    );
  }
});

module.exports = Dashboard;
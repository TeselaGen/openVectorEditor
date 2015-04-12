var React = require('react');
var fakedata = require('./fakedata.js');
var SequenceLine = require('./SequenceLine.js');
var Authentication = require('./Authentication.js');
var auth = require('./auth.js');

var exampleMetaData = [{
  "columnName": "name",
  "order": 9,
  "locked": false,
  "visible": true,
  "displayName": "Employee Name"
}, {
  "columnName": "city",
  "order": 8,
  "locked": false,
  "visible": true
}, {
  "columnName": "state",
  "order": 7,
  "locked": false,
  "visible": true
}, {
  "columnName": "country",
  "order": 6,
  "locked": false,
  "visible": true
}, {
  "columnName": "company",
  "order": 5,
  "locked": false,
  "visible": true
}, {
  "columnName": "favoriteNumber",
  "order": 4,
  "locked": false,
  "visible": true,
  "displayName": "Favorite Number"
}];

var SequenceLibrary = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    return (
      <div>
          <SequenceLine/>
      </div>
    );
  }
});

module.exports = SequenceLibrary;
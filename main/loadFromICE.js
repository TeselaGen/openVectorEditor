var ReactDOM = require('react-dom');
var App = require('../app/App.js');
import request from 'superagent/lib/client';
import {toOpenVectorEditor} from '../app/schemaConvert';

var query = location.search;
var id;
    id = query.match(/entryId=[0-9a-z\-]+/) + "";
    id = id.replace(/entryId=/, "");

var cookie = document.cookie;
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
    sid = sid.replace(/sessionId=|%22/g, "");

// async response call
request
    .get('rest/parts/' + id + '/sequence')
    .set('X-ICE-Authentication-sessionId', sid)
    .accept('application/json')
    .end(function(err, result) {
        var contents = result.body;
        if (!contents) {
          // add some empty data
          contents = {
              canEdit: false,
              features: [],
              identifier: "",
              name: "new sequence",
              isCircular: false,
              length: 0,
              sequence: ""
          }
        }

        //Editor is the React Component
        //controller is the cerebral state controller
        var {Editor, controller} = App(toOpenVectorEditor(contents, {request: request}));
        //choose the dom node you want to render to
        const DOMNodeToRenderTo = document.createElement('div');
        document.body.appendChild(DOMNodeToRenderTo);
        ReactDOM.render(Editor, DOMNodeToRenderTo);
    }
);

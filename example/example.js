var ReactDOM = require('react-dom')
var colorOfFeature = require('./colorOfFeature')
var App = require('../app/App.js')
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

// async response call
request
    .get('rest/parts/' + id + '/sequence')
    .set('X-ICE-Authentication-sessionId', sid)
    .accept('application/json')
    .end(function(err, result) {
        var contents = result.body;
        var sequence = contents.sequence;
        var name = contents.name;
        var isCircular = contents.isCircular;
        var canEdit = contents.canEdit;
        var seqId = contents.identifier;
        var featureList = [];
        var embedded = document.location.pathname.match(/entry/);
        for (var f = 0; f < contents.features.length; f++) { 
            featureList.push(contents.features[f]);
        }       
        // reformat feature data a little
        for (var p = 0; p < featureList.length; p++) {
            featureList[p].start = featureList[p].locations[0].genbankStart;
            featureList[p].end = featureList[p].locations[0].end;
            featureList[p].color = colorOfFeature(featureList[p]);
        }
        var options = {
            state: {
                sequenceData: {
                    features: featureList,
                    _id: seqId,
                    sequence: sequence,
                    circular: isCircular
                },
                embedded: !!embedded, // forcing a Boolean
                readOnly: !canEdit, // forced falsed Boolean
                name: name,
            },
            services: {
                request: request
            },
            actions: {
                // nothing here currently
            }
        }

        //Editor is the React Component
        //controller is the cerebral state controller
        var {Editor, controller} = App(options);
        //choose the dom node you want to render to
        const DOMNodeToRenderTo = document.createElement('div');
        document.body.appendChild(DOMNodeToRenderTo);
        ReactDOM.render(Editor, DOMNodeToRenderTo);
    }
);
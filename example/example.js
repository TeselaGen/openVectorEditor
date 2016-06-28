var ReactDOM = require('react-dom')
var App = require('../app/App.js')
import request from 'superagent/lib/client';
import fakeIceSequenceData from './fakeIceSequenceData'

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
        if (!contents) {
          //use an example ice response
          contents = fakeIceSequenceData
        }
        var sequence = contents.sequence;
        var name = contents.name;
        var isCircular = contents.isCircular;
        var canEdit = contents.canEdit;
        var seqId = contents.identifier;
        var featureList = [];
        var embedded = document.location.pathname.match(/entry/);

        // maybe move this
        var colorFeature = function(feature) {
            var type = feature.type;
            type = type.toLowerCase();
            var color = "#CCCCCC";
            switch(type) {
                case "promoter":
                    color = "#31B440";
                    break;
                case "terminator":
                    color = "#F51600";
                    break;
                case "cds":
                    color = "#EF6500";
                    break;
                case "misc_feature":
                    color = "#006FEF";
                    break;
                case "m_rna":
                    color = "#FFFF00";
                    break;
                case "misc_binding":
                    color = "#006FEF";
                    break;                   
                case "misc_marker":
                    color = "#8DCEB1";
                    break;
                case "rep_origin":
                    color = "#878787";
                    break;
                default:
                    // leave it gray            
            }
            return color;
        }

        for (var f = 0; f < contents.features.length; f++) { 
            featureList.push(contents.features[f]);
        }       
        // reformat feature data a little
        for (var p = 0; p < featureList.length; p++) {
            featureList[p].start = featureList[p].locations[0].genbankStart;
            featureList[p].end = featureList[p].locations[0].end;
            featureList[p].color = colorFeature(featureList[p]);
        }

        var options = {
            state: {
                sequenceData: {
                    features: featureList,
                    _id: seqId,
                    sequence: sequence,
                    circular: isCircular,
                    name: name
                },
                embedded: !!embedded, // forcing a Boolean
                readOnly: !canEdit // forced falsed Boolean
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

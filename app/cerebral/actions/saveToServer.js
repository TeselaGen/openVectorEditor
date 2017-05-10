// upload a copy of the current plasmid in genbank or sbol format to ice
import request from 'superagent/lib/client';
import assign from 'lodash/object/assign';
import {toICE} from '../../schemaConvert'

// var query = location.search;
var cookie = document.cookie;
// var id = query.match(/entryId=[0-9a-z\-]+/) + "";
// id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToServer({input, state, output}) {
    var convertedState = toICE(state);
    var iceId = state.get('iceEntryId');
    iceId = iceId.replace(/.+entry\//, "");

    request
        .post('rest/parts/' + iceId + '/sequence?sid=' + sid)
        .set('X-ICE-Authentication-sessionId', sid)
        .set('Content-Type', 'application/json')
        .send(convertedState)
        .end(function(err, result) {
            if(err) {
                console.log("unable to save to registry, something went wrong: " + err)
            }
        }
    );

    state.set('savedIdx', state.get('historyIdx')); // update savedIdx
}

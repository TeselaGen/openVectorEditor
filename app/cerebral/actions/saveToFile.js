// download a copy of the current plasmid in genbank or sbol format
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToFile({input, state, output}) {
    var { fileExt } = input;
    var fileName = state.get('name');
    var fileContent = "";
    var entryFile;

    // safety checks
    if(!fileName || fileName.length == 0) {
        fileName = "unknown_sequence";
    }
    // this probably can't happen but whatever
    if(!fileExt || fileExt.length == 0) {
        fileExt = "txt";
    }

    request
    .get('rest/file/' + id + '/sequence/' + fileExt + '?sid=' + sid)
    .set('X-ICE-Authentication-sessionId', sid)
    .end(function(err, result) {
        if(err) {
            console.log(err)
        }
    });
    
}
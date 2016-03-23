// load info in from a genbank, sbol, or fasta file
// uses npmjs library bio-parsers
// uses superagent to post the file back to node server
// do we need to do that though? can we just slam it into the state tree?
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function loadFromFile({input, state, output}) {
    var seqFileParser = require('bio-parsers/parsers/anyToJSON');

    console.log("did it. :3");

    if(id && sid) 
    {
        request
            .post('rest/parts/sequence')
            .set('X-ICE-Authentication-sessionId', sid)
            .set('Content-Type', 'application/json')
            .send(/* results of seqfileparser? or is that on node server*/)
            .end(function(err, result) {
                if(err) {
                    console.log("unable to load file, something went wrong: " + err)
                }
            }
        );
    } else {
        console.log("something went wrong, unable to upload file");
    }

}
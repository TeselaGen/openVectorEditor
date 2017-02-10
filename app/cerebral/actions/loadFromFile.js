// load info in from a genbank, sbol, or fasta file
// uses superagent to post the file back to node server to interpret
// do we need to do that though? can we just slam it into the state tree?
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

/**
 * Upload the sequence file to the server to be parsed.
 * The parsed sequence is not associated with the current entry that the user is viewing but rather
 * requires clicking "save"
 */
export default function loadFromFile({input, state, output}) {
    var { inputFile } = input;
    var error = "";
    var result;

    request.post('rest/file/sequence/model')
        .set('X-ICE-Authentication-sessionId', sid)
        .attach("file", inputFile)
        .end((err, res) => {
            if (res) {
                result = res;
                console.log("result = " + result)
            } else {
                // error = err;
                console.log("error = " + error)
            }
        });

    if (result) {
        output.success({newSequenceData: result});
    } else {
        // output.error({error: error});
    }
}
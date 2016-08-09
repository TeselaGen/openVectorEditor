// load info in from a genbank, sbol, or fasta file
// uses npmjs library bio-parsers
// uses superagent to post the file back to node server
// do we need to do that though? can we just slam it into the state tree?
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
//var id = query.match(/entryId=[\d]+/) + "";
//id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

/**
 * Upload the sequence file to the server to be parsed.
 * The parsed sequence is not associated with the current entry that the user is viewing but rather
 * requires clicking "save"
 * @param input
 * @param state
 * @param output
 */
export default function loadFromFile({input, state, output}) {
    var { inputFile } = input;

    request.post('rest/file/sequence/model')
        .set('X-ICE-Authentication-sessionId', sid)
        .attach("file", inputFile)
        .end((err, res) => {
            //console.log(err);
            if (res) {
                let sequenceData = res.body.sequence;
                output.success({'newSequenceData': sequenceData});
            }
        });
}
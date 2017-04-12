// load info in from a genbank, sbol, or fasta file
// uses superagent to post the file back to node server to interpret
// do we need to do that though? can we just slam it into the state tree?
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

function loadFromFile({input, state, output}) {
    var { inputFile } = input;

    request.post('rest/file/sequence/model')
        .set('X-ICE-Authentication-sessionId', sid)
        .attach("file", inputFile)
        .end((err, res) => {
            if (res) {
                var sequenceResult = res.body.sequence;
                output.success({newSequenceData: sequenceResult});
            } else {
                output.error({error: err.message});
            }
        }
    );
};

loadFromFile.async = true;

export default loadFromFile;
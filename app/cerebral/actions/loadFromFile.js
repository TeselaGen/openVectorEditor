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
    var { inputFile } = input;

    request.post('rest/file/sequence')
        .set('X-ICE-Authentication-sessionId', sid)
        .field("entryRecordId", id)
        .field("entryType", "part")
        .attach("file", inputFile)
        .end((err, res) => {
            //console.log(err);
            //console.log(res);
            if (res) {

                console.log(res.body.sequence);
                let sequenceData = res.body.sequence;
                sequenceData.cutsites = [];
                sequenceData.orfs = [];
                sequenceData.translations = [];
                sequenceData.parts = [];

                //'features','parts','cutsites','orfs','translations'
                state.set('sequenceData', sequenceData);
            }
        });
}
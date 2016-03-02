// upload a copy of the current plasmid in genbank or sbol format to ice
import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToServer({input, state, output}) {
    // BUILD AN OBJECT FROM THE STATE TREE THAT'S SETUP THE WAY JSON WANTS
    // MAKE SURE YOU'RE TYPING IN ALL CAPS
    // THEN PUT THAT OBJECT IN THE BODY OF THE REQUEST TO THE URL BELOw
    var newSequenceData = state.get("sequenceData");

    // may need to detect parts plasmid &c.
    window.open('rest/parts/' + id + '/sequence?sid=' + sid)

}
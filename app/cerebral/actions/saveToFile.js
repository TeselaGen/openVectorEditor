// download a copy of the current plasmid in genbank or sbol format
// import request from 'superagent/lib/client';

var query = location.search;
var cookie = document.cookie;
var id = query.match(/entryId=[\d]+/) + "";
id = id.replace(/entryId=/, "");
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToFile({input, state, output}) {
    var { fileExt } = input;

    if(fileExt.match("sbol|genbank|fasta|original")
        && id
        && sid) 
    // a request made to ice with this format will tell it to send the file for download
    {
        window.open('rest/file/' + id + '/sequence/' + fileExt + '?sid=' + sid)
    } else {
        console.log("something went wrong, unable to find file");
    }

}
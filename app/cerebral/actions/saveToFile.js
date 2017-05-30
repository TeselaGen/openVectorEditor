// download a copy of the current plasmid in genbank or sbol format

var cookie = document.cookie;
var sid = cookie.match(/sessionId=%22[0-9a-z\-]+%22/) + "";
sid = sid.replace(/sessionId=|%22/g, "");

export default function saveToFile({input, state, output}) {
    var { fileExt } = input;
    var iceId = state.get('iceEntryId');
        iceId = iceId.replace(/.+entry\//, "");
    var origin = document.location.origin;

    if(fileExt.match("sbol1|sbol2|genbank|fasta|original")
        && iceId
        && sid) 
    // a request made to ice with this format will tell it to send the file for download
    {
        window.open(origin + '/rest/file/' + iceId + '/sequence/' + fileExt + '?sid=' + sid)
    } else {
        console.log("something went wrong, unable to find file");
    }

}
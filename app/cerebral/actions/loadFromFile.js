// load info in from a genbank, sbol, or fasta file
// uses npmjs library bio-parsers
// uses superagent to post the file back to node server

export default function saveToFile({input, state, output}) {
    var seqFileParser = require('bio-parsers/parsers/anyToJSON');

    console.log("did it. :3");

    // if(fileExt.match("sbol|gb|fasta")
    //     && id
    //     && sid) 
    // {
    //     window.open('rest/file/' + id + '/sequence/' + fileExt + '?sid=' + sid)
    // } else {
    //     console.log("something went wrong, unable to find file");
    // }

}
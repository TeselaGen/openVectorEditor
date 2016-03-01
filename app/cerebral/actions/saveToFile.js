// download a copy of the current plasmid in genbank or sbol format
import request from 'superagent/lib/client';

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

    // use sboljs to build an sbol file (version 2)
    // if (fileExt == 'sbol') {
    //     console.log("building an sbol file to export");

    //     fileContent = state.get("sequenceData.sequence");
    // } else { if (fileExt == 'gb') {
    //     // build a genBank file
    //     console.log("building a genbank file to export");
    //     var { name, sequenceLength } = state.get();

    // }}
    request
    .get()
    .accept()
    .end(function() {

    });
    
}
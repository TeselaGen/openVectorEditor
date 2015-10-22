// let seqString = "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcg"
// for (let i = 0; i < 10; i++) {
//     seqString += seqString
// };
let seqLen = 10000;
let seqString = generateSequence(seqLen);
var objectid = require("bson-objectid");

function generateSequence(m = 9) {
    let s = '';
    let r = 'gatc';
    for (let i = 0; i < m; i++) {
        s += r.charAt(Math.floor(Math.random() * r.length));
    }
    return s;
}

function generateAnnotations(numberOfAnnotationsToGenerate, endBp, circular) {
    let result = [];
    for (let i = 0; i < numberOfAnnotationsToGenerate; i++) {
        result[i] = generateAnnotation(endBp);
    }
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateAnnotation(endBp) {
    let start = getRandomInt(0, endBp);
    let end = getRandomInt(0, endBp);
    if (start > end) {
        if (Math.random() < 0.95) {
            var endHolder = end;
            end = start;
            start = endHolder;
        }
    }
    return {
        "name": getRandomInt(0, 100000).toString(),
        "type": "misc_feature",
        start,
        end,
        id: objectid().str,
        "forward": getRandomInt(0, 1) > 0.5 ? true : false,
        "notes": []
    };
}


var sequenceData = {
    "_id": "55a34cf01d8e1e8ea7000006",
    "name_lowercase": "pj5_00001",
    "FQDN": "tnrich.pj5_00001",
    "sequence": seqString,
    "circular": true,
    "sequenceFileName": "pj5_00001.gb",
    "name": "pj5_00001",
    "sequenceFileFormat": "Genbank",
    "ve_metadata": "",
    "size": 5299,
    "dateModified": "2015-07-14T05:40:42.262Z",
    "dateCreated": "2015-07-13T05:30:24.986Z",
    "hash": "78cfd9da32ffb86af10057c8dd53ac30c607ed1d8991461a0a46cd14442935de",
    "description": "",
    "user_id": "54220bb6f54aa7432861e7dd",
    "translations": generateAnnotations(5, seqLen),
    "features": generateAnnotations(10, seqLen),
    "parts": generateAnnotations(10, seqLen),
    "extraLines": [],
    "__v": 4
};

// tnr: this is used to generate a very large, multi-featured sequence
// var string = "ggggcccccgggggccc";
// var reallyLongFakeSequence = "";
// for (var i = 1; i < 100000; i++) {
//   reallyLongFakeSequence += string;
//   if (i % 100 === 0) {
//     reallyLongFakeSequence += 'taafatg';
//     sequenceData.features.push({
//       id: i,
//       start: parseInt(i * 10),
//       end: parseInt(i * 10 + 100),
//       name: 'cooljim',
//       color: 'green',
//       forward: true,
//       annotationType: "feature"
//     });
//   }
// }
// sequenceData.sequence += reallyLongFakeSequence;
// 
module.exports = sequenceData;

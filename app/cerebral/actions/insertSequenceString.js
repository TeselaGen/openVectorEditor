<<<<<<< HEAD
// doesn't seem like this is ever used, commenting out

// var insertSequenceData = require('./insertSequenceData');
// export default function insertSequenceString({sequenceString}, tree, output) {
//     insertSequenceData({
//         sequence: sequenceString
//     });
// }
=======
var insertSequenceData = require('./insertSequenceData');
export default function insertSequenceString({input: {sequenceString}, state, output}) {
    insertSequenceData({
        sequence: sequenceString
    });
}
>>>>>>> 53358bad31800faafcc049764ad30a6dba364dae

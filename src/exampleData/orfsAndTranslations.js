let seqString1 =
  "atgatggagagagagagagcgcgcgcagcagcgacgacgacggctagctacgatcgactagctagctacgatcgatcgatcgactagctagctacgatcgatcgatcgactgatcgactgactagctgcatgtaa";
let seqString = "";
for (let i = 0; i < 10000; i++) {
  seqString += seqString1;
}
let sequenceData = {
  sequence: seqString,
  circular: true,
  sequenceFileName: "pj5_00001.gb",
  name: "pj5_00001",
  size: 5299,
  description: "",
  translations: [
    {
      name: "Operator I2 and I1",
      type: "protein_bind",
      id: "55a4a061f0c5b500012a8qqqq",
      start: 1123,
      end: 1162,
      strand: 1,
      notes: []
    },
    {
      name: "pBAD promoter",
      type: "promoter",
      id: "55a4a061f0c5b500312340a8qqqq",
      start: 1163,
      end: 1188,
      strand: 1,
      notes: []
    }
    // {
    //   "name": "RBS",
    //   "type": "RBS",
    //   "id": "55a4a061f0c5b5012100a8qqqq",
    //   "start": 1215,
    //   "end": 1235,
    //   "strand": 1,
    //   "notes": []
    // }, {
    //   "name": "GFPuv",
    //   "type": "CDS",
    //   "id": "55a4a061f0c5b5061100a8qqqq",
    //   "start": 1236,
    //   "end": 2018,
    //   "strand": 1,
    //   "notes": [{
    //     "name": "vntifkey",
    //     "value": "4",
    //     "quoted": true
    //   }]
    // }, {
    //   "name": "XhoI_silent_mutation",
    //   "type": "misc_feature",
    //   "id": "55a4a061f0c5b5000a8qqqq",
    //   "start": 1660,
    //   "end": 1661,
    //   "strand": 1,
    //   "notes": []
    // }, {
    //   "name": "BamHI_silent_mutation",
    //   "type": "misc_feature",
    //   "id": "55a4a061f0c5b5012400a8qqqq",
    //   "start": 1759,
    //   "end": 1760,
    //   "strand": 1,
    //   "notes": []
    // }, {
    //   "name": "signal_peptide",
    //   "type": "CDS",
    //   "id": "55a4a061f0c5b5004420a8qqqq",
    //   "start": 1952,
    //   "end": 2015,
    //   "strand": 1,
    //   "notes": [{
    //     "name": "vntifkey",
    //     "value": "4",
    //     "quoted": true
    //   }]
    // }, {
    //   "name": "dbl term",
    //   "type": "terminator",
    //   "id": "55a4a061f0c5b5000a4158qqqq",
    //   "start": 2033,
    //   "end": 2162,
    //   "strand": 1,
    //   "notes": []
    // }, {
    //   "name": "pSC101**",
    //   "type": "rep_origin",
    //   "id": "55a4a061f0c5b5000a31248qqqq",
    //   "start": 2163,
    //   "end": 4392,
    //   "strand": -1,
    //   "notes": []
    // }, {
    //   "name": "T0",
    //   "type": "terminator",
    //   "id": "55a4a061f0c5b50012450a8qqqq",
    //   "start": 4392,
    //   "end": 4498,
    //   "strand": 1,
    //   "notes": []
    // }, {
    //   "name": "CmR",
    //   "type": "misc_marker",
    //   "id": "55a4a061f0c5b526362000a8qqqq",
    //   "start": 4513,
    //   "end": 5173,
    //   "strand": -1,
    //   "notes": []
    // }
  ],
  features: [
    {
      name: "Operator I2 and I1",
      type: "protein_bind",
      id: "55a4a061f0c5b50asd00a8bfaf5",
      start: 4,
      end: 20,
      strand: 1,
      notes: []
    },
    {
      name: "pBAD promoter",
      type: "promoter",
      id: "55a4a061f0c5b5000a8bfaf6",
      start: 1160,
      end: 1188,
      strand: 1,
      notes: []
    },
    {
      name: "RBS",
      type: "RBS",
      id: "55a4a061f0c5b5000a8bfaf7",
      start: 1215,
      end: 1235,
      strand: 1,
      notes: []
    },
    {
      name: "GFPuv",
      type: "CDS",
      id: "55a4a061f0c5b5000a8bfaf8",
      start: 1235,
      end: 2018,
      strand: 1,
      notes: [
        {
          name: "vntifkey",
          value: "4",
          quoted: true
        }
      ]
    },
    {
      name: "XhoI_silent_mutation",
      type: "misc_feature",
      id: "55a4a061f0c5b5000a8bfaf9",
      start: 1660,
      end: 1661,
      strand: 1,
      notes: []
    },
    {
      name: "BamHI_silent_mutation",
      type: "misc_feature",
      id: "55a4a061f0c5b5000a8bfafa",
      start: 1759,
      end: 1760,
      strand: 1,
      notes: []
    },
    {
      name: "signal_peptide",
      type: "CDS",
      id: "55a4a061f0c5b5000a8bfafb",
      start: 1952,
      end: 2015,
      strand: 1,
      notes: [
        {
          name: "vntifkey",
          value: "4",
          quoted: true
        }
      ]
    },
    {
      name: "dbl term",
      type: "terminator",
      id: "55a4a061f0c5b5000a8bfafc",
      start: 2033,
      end: 2162,
      strand: 1,
      notes: []
    },
    {
      name: "pSC101**",
      type: "rep_origin",
      id: "55a4a061f0c5b5000a8bfafd",
      start: 2163,
      end: 4392,
      strand: -1,
      notes: []
    },
    {
      name: "T0",
      type: "terminator",
      id: "55a4a061f0c5b5000a8bfafe",
      start: 4392,
      end: 4498,
      strand: 1,
      notes: []
    },
    {
      name: "CmR",
      type: "misc_marker",
      id: "55a4a061f0c5b5000a8bfaff",
      start: 4513,
      end: 5173,
      strand: -1,
      notes: []
    }
  ]
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
export default sequenceData;

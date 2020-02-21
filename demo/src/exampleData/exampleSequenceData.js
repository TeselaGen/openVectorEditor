// import { generateSequenceData } from "ve-sequence-utils";

// export default {
// 	sequence: 'gagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggg',
// 	circular: true,
// 	sequenceFileName: "pj5_00001.gb",
// 	name: "pj5_00001",
// 	size: 5299,
// 	description: "",
// 	translations: [
// 	  {
// 	    name: "Operator I2 and I1",
// 	    type: "protein_bind",
// 	    id: "55a4a061f0c5b500012a8qqqq",
// 	    start: 1123,
// 	    end: 1162,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "pBAD promoter",
// 	    type: "promoter",
// 	    id: "55a4a061f0c5b500312340a8qqqq",
// 	    start: 1163,
// 	    end: 1188,
// 	    strand: 1,
// 	    notes: []
// 	  }
// 	  // {
// 	  //   "name": "RBS",
// 	  //   "type": "RBS",
// 	  //   "id": "55a4a061f0c5b5012100a8qqqq",
// 	  //   "start": 1215,
// 	  //   "end": 1235,
// 	  //   "strand": 1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "GFPuv",
// 	  //   "type": "CDS",
// 	  //   "id": "55a4a061f0c5b5061100a8qqqq",
// 	  //   "start": 1236,
// 	  //   "end": 2018,
// 	  //   "strand": 1,
// 	  //   "notes": [{
// 	  //     "name": "vntifkey",
// 	  //     "value": "4",
// 	  //     "quoted": true
// 	  //   }]
// 	  // }, {
// 	  //   "name": "XhoI_silent_mutation",
// 	  //   "type": "misc_feature",
// 	  //   "id": "55a4a061f0c5b5000a8qqqq",
// 	  //   "start": 1660,
// 	  //   "end": 1661,
// 	  //   "strand": 1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "BamHI_silent_mutation",
// 	  //   "type": "misc_feature",
// 	  //   "id": "55a4a061f0c5b5012400a8qqqq",
// 	  //   "start": 1759,
// 	  //   "end": 1760,
// 	  //   "strand": 1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "signal_peptide",
// 	  //   "type": "CDS",
// 	  //   "id": "55a4a061f0c5b5004420a8qqqq",
// 	  //   "start": 1952,
// 	  //   "end": 2015,
// 	  //   "strand": 1,
// 	  //   "notes": [{
// 	  //     "name": "vntifkey",
// 	  //     "value": "4",
// 	  //     "quoted": true
// 	  //   }]
// 	  // }, {
// 	  //   "name": "dbl term",
// 	  //   "type": "terminator",
// 	  //   "id": "55a4a061f0c5b5000a4158qqqq",
// 	  //   "start": 2033,
// 	  //   "end": 2162,
// 	  //   "strand": 1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "pSC101**",
// 	  //   "type": "rep_origin",
// 	  //   "id": "55a4a061f0c5b5000a31248qqqq",
// 	  //   "start": 2163,
// 	  //   "end": 4392,
// 	  //   "strand": -1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "T0",
// 	  //   "type": "terminator",
// 	  //   "id": "55a4a061f0c5b50012450a8qqqq",
// 	  //   "start": 4392,
// 	  //   "end": 4498,
// 	  //   "strand": 1,
// 	  //   "notes": []
// 	  // }, {
// 	  //   "name": "CmR",
// 	  //   "type": "misc_marker",
// 	  //   "id": "55a4a061f0c5b526362000a8qqqq",
// 	  //   "start": 4513,
// 	  //   "end": 5173,
// 	  //   "strand": -1,
// 	  //   "notes": []
// 	  // }
// 	],
// 	features: [
// 	  {
// 	    name: "Operator I2 and I1",
// 	    type: "protein_bind",
// 	    id: "55a4a061f0c5b50asd00a8bfaf5",
// 	    start: 4,
// 	    end: 20,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "pBAD promoter",
// 	    type: "promoter",
// 	    id: "55a4a061f0c5b5000a8bfaf6",
// 	    start: 1160,
// 	    end: 1188,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "RBS",
// 	    type: "RBS",
// 	    id: "55a4a061f0c5b5000a8bfaf7",
// 	    start: 1215,
// 	    end: 1235,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "GFPuv",
// 	    type: "CDS",
// 	    id: "55a4a061f0c5b5000a8bfaf8",
// 	    start: 1235,
// 	    end: 2018,
// 	    strand: 1,
// 	    notes: [
// 	      {
// 	        name: "vntifkey",
// 	        value: "4",
// 	        quoted: true
// 	      }
// 	    ]
// 	  },
// 	  {
// 	    name: "XhoI_silent_mutation",
// 	    type: "misc_feature",
// 	    id: "55a4a061f0c5b5000a8bfaf9",
// 	    start: 1660,
// 	    end: 1661,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "BamHI_silent_mutation",
// 	    type: "misc_feature",
// 	    id: "55a4a061f0c5b5000a8bfafa",
// 	    start: 1759,
// 	    end: 1760,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "signal_peptide",
// 	    type: "CDS",
// 	    id: "55a4a061f0c5b5000a8bfafb",
// 	    start: 1952,
// 	    end: 2015,
// 	    strand: 1,
// 	    notes: [
// 	      {
// 	        name: "vntifkey",
// 	        value: "4",
// 	        quoted: true
// 	      }
// 	    ]
// 	  },
// 	  {
// 	    name: "dbl term",
// 	    type: "terminator",
// 	    id: "55a4a061f0c5b5000a8bfafc",
// 	    start: 2033,
// 	    end: 2162,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "pSC101**",
// 	    type: "rep_origin",
// 	    id: "55a4a061f0c5b5000a8bfafd",
// 	    start: 2163,
// 	    end: 4392,
// 	    strand: -1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "T0",
// 	    type: "terminator",
// 	    id: "55a4a061f0c5b5000a8bfafe",
// 	    start: 4392,
// 	    end: 4498,
// 	    strand: 1,
// 	    notes: []
// 	  },
// 	  {
// 	    name: "CmR",
// 	    type: "misc_marker",
// 	    id: "55a4a061f0c5b5000a8bfaff",
// 	    start: 4513,
// 	    end: 5173,
// 	    strand: -1,
// 	    notes: []
// 	  }
// 	],

// }

// export default {
// 	"primers": [
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "primer 1",
// 					"start": 4,
// 					"end": 400
// 			}
// 		],
// 	"parts": [
// 		{
// 			name: "Test Part",
// 			start: 50,
// 			end: 5000,
// 			strand: 1
// 		}
// 	],
// 	"features": [
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "pBAD promoter",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"#ff8000"
// 							],
// 							"ApEinfo_label": [
// 									"BsaI"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_revcolor": [
// 									"green"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "BsaI(2)",
// 					"start": 2079,
// 					"end": 2084
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": 1,
// 					"name": "DVA02685_(ttgBC-3)_forward",
// 					"start": 3790,
// 					"end": 3807
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff80ff"
// 							],
// 							"ApEinfo_revcolor": [
// 									"#8080ff"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgB",
// 					"start": 3790,
// 					"end": 4310
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "araC",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"green"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff8000"
// 							],
// 							"ApEinfo_label": [
// 									"BsaI"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "BsaI(1)",
// 					"start": 1583,
// 					"end": 1588
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": -1,
// 					"name": "DVA02679_(ttgBC-1)_reverse",
// 					"start": 5739,
// 					"end": 5774
// 			},
// 			{
// 					"notes": {
// 							"vntifkey": [
// 									"43"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							]
// 					},
// 					"type": "terminator",
// 					"strand": 1,
// 					"name": "terminator",
// 					"start": 7218,
// 					"end": 7323
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": 1,
// 					"name": "DVA02680_(pBbB8k-backbone)_forward",
// 					"start": 5748,
// 					"end": 5787
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							]
// 					},
// 					"type": "RBS",
// 					"strand": 1,
// 					"name": "RBS",
// 					"start": 9505,
// 					"end": 9524
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": 1,
// 					"name": "DVA02699_(ttgB-1)_forward",
// 					"start": 2221,
// 					"end": 2210
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"green"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"cyan"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "S878P butanol var1-2 (T->C)",
// 					"start": 3790,
// 					"end": 3791
// 			},
// 			{
// 					"notes": {
// 							"vntifkey": [
// 									"33"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							]
// 					},
// 					"type": "rep_origin",
// 					"strand": -1,
// 					"name": "rep_origin",
// 					"start": 5921,
// 					"end": 7211
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"30"
// 							]
// 					},
// 					"type": "promoter",
// 					"strand": -1,
// 					"name": "promoter",
// 					"start": 9315,
// 					"end": 9343
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "araC promoter",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"#8080ff"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff80ff"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgB",
// 					"start": 1158,
// 					"end": 2219
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"31"
// 							]
// 					},
// 					"type": "protein_bind",
// 					"strand": 1,
// 					"name": "protein_bind",
// 					"start": 9351,
// 					"end": 9372
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "CAP site",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "operator O1",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "operator O2",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_revcolor": [
// 									"#804040"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff8000"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgC",
// 					"start": 4307,
// 					"end": 5761
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "dbl term",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": -1,
// 					"name": "DVA02681_(pBbB8k-backbone)_reverse",
// 					"start": 9489,
// 					"end": 17
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"21"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "misc_feature",
// 					"start": 5786,
// 					"end": 5914
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"31"
// 							]
// 					},
// 					"type": "protein_bind",
// 					"strand": 1,
// 					"name": "protein_bind",
// 					"start": 9193,
// 					"end": 9210
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"20"
// 							]
// 					},
// 					"type": "misc_binding",
// 					"strand": 1,
// 					"name": "misc_binding",
// 					"start": 9394,
// 					"end": 9407
// 			},
// 			{
// 					"notes": {
// 							"vntifkey": [
// 									"30"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							]
// 					},
// 					"type": "promoter",
// 					"strand": 1,
// 					"name": "promoter",
// 					"start": 9440,
// 					"end": 9467
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"cyan"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_revcolor": [
// 									"green"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "M355L butanol var2 (A->C)",
// 					"start": 2221,
// 					"end": 2222
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "T0",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"#ff0080"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff8080"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgA",
// 					"start": 0,
// 					"end": 1154
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": 1,
// 					"name": "DVA02676_(ttgAB-1)_forward",
// 					"start": 9503,
// 					"end": 24
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff80ff"
// 							],
// 							"ApEinfo_revcolor": [
// 									"#8080ff"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgB",
// 					"start": 2554,
// 					"end": 3788
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"cyan"
// 							],
// 							"ApEinfo_revcolor": [
// 									"green"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "I466F butanol var1 (A->T)",
// 					"start": 2554,
// 					"end": 2555
// 			},
// 			{
// 					"notes": {
// 							"note": [
// 									"From pMBIS, introduced point mutation to increas"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "BBR1 ori",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"note": [
// 									"encodes nptII (aka AphA, neoR), gives kan and ne"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "Kan/neoR",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": -1,
// 					"name": "DVA02700_(ttgB-1)_(I466F)_reverse",
// 					"start": 2535,
// 					"end": 2570
// 			},
// 			{
// 					"notes": {
// 							"SerialCloner_Protect": [
// 									"True"
// 							],
// 							"SerialCloner_Desc": [
// 									"vntifkey"
// 							],
// 							"SerialCloner_Show": [
// 									"True"
// 							],
// 							"SerialCloner_Arrow": [
// 									"True"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"SerialCloner_Color": [
// 									"&h84A4C0"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "RBS",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": -1,
// 					"name": "DVA02677_(ttgAB-1)_(M355L)_reverse",
// 					"start": 2197,
// 					"end": 2246
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": -1,
// 					"name": "DVA02684_(ttgAB-3)_(S878P)_reverse",
// 					"start": 3771,
// 					"end": 3815
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"22"
// 							]
// 					},
// 					"type": "misc_marker",
// 					"strand": -1,
// 					"name": "misc_marker",
// 					"start": 7349,
// 					"end": 8143
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"pink"
// 							],
// 							"ApEinfo_revcolor": [
// 									"pink"
// 							],
// 							"featureType": [
// 									"width"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "operator I2 and I1",
// 					"start": 4,
// 					"end": 4
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_fwdcolor": [
// 									"#ff8040"
// 							],
// 							"ApEinfo_revcolor": [
// 									"green"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": 1,
// 					"name": "BsaI",
// 					"start": 756,
// 					"end": 761
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {}0"
// 							],
// 							"ApEinfo_fwdcolor": [
// 									"#ff80ff"
// 							],
// 							"ApEinfo_revcolor": [
// 									"#8080ff"
// 							]
// 					},
// 					"type": "misc_feature",
// 					"strand": -1,
// 					"name": "ttgB",
// 					"start": 2221,
// 					"end": 2552
// 			},
// 			{
// 					"notes": {
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							],
// 							"vntifkey": [
// 									"4"
// 							]
// 					},
// 					"type": "CDS",
// 					"strand": -1,
// 					"name": "CDS",
// 					"start": 8286,
// 					"end": 9164
// 			},
// 			{
// 					"notes": {
// 							"vntifkey": [
// 									"31"
// 							],
// 							"ApEinfo_graphicformat": [
// 									"arrow_data {{0 1 2 0 0 -1} {} 0"
// 							]
// 					},
// 					"type": "protein_bind",
// 					"strand": 1,
// 					"name": "protein_bind",
// 					"start": 9403,
// 					"end": 9441
// 			},
// 			{
// 					"notes": {},
// 					"type": "primer_bind",
// 					"strand": 1,
// 					"name": "DVA02701_(ttgB-2)_forward",
// 					"start": 2539,
// 					"end": 2576
// 			}
// 	],
// 	"name": "pBbB8k-ttg",
// 	"sequence": "atgcaattcaagccagccgttaccgctctggtttccgccgtcgccctggcaaccctgctcagtggctgtaagaaagaagaagcagcgccagcggcgcaggctcctcaggtcggcgtcgtgaccatccagccgcaagccttcaccctcacctcggaattgccggggcgaaccagtgcctaccgcgttgccgaagtgcgcccgcaggtcaacggcatcatcctcaagcgcctgttcaaggaaggcagtgaggtcaaggaaggccagcagttgtatcagatcgaccctgccgtgtacgaagccaccctggccaatgccaaggccaacctgctggctacacgctcactggccgaacgctacaagcaactgattgacgaacaggccgtctccaaacaggaatacgacgacgccaatgccaaacgattgcaggctgaggcttcgctcaagagcgcacagatcgacctgcgctacaccaaggttctggcgccgatcagcggccgtatcggtcgctcttcgttcaccgaaggtgcactggtgagcaacggtcagaccgacgccatggccaccatccagcagctcgatcctatttatgtcgacgttacccagtccaccgccgagctgctcaagctgcgccgtgacctggaaagcggccagttgcagaaggctggcaacaacgccgcctcggttcagctggtgctggaagacggcagcctgttcaagcaggaaggtcgcctggagttctccgaagtcgcggttgacgagaccaccggctcggtgaccctgcgcgcgctgttccccaaccccgatcacaccctgctgccaggcatgttcgtgcatgcgcggctcaaggccggggtcaacgccaacgccatcctggcaccgcaacaaggcgtgacccgcgacctcaagggcgcacccaccgccctggtggtcaaccaggagaacaaggttgaactgcgccagctcaaggccagccgcaccttgggtagcgactggctgatcgaggaaggcctcaacccgggtgaccgcctgatcaccgaagggctgcagtacgtgcgcccaggcgtcgaggtgaaggtcagcgatgccaccaacgtcaagaagccggccggccctgatcaggccaacgcggcgaaagcagacgccaaagcggagtaaaccatgtcgaagttctttatcgatcgcccgatcttcgcctgggtgatcgccttggtgatcatgctggtcggggccttgtctatcctgaagctgccgatcaaccagtaccccagtatcgcgccgccggccatcgccatcgccgtgacctacccgggcgcctcggcgcaaaccgtgcaggacaccgtggtgcaggtgatcgagcagcagctcaacggtatcgacaacctgcgttatgtgtcgtcggaaagtaactccgacggcagcatgaccattaccgccaccttcgaacagggcaccaaccccgacaccgcgcaggtacaggtacagaacaagctgaacctggccaccccgctgctgccgcaggaagtgcagcagcaaggtatccgcgtcaccaaagcagtgaagaacttcctgctggtgattggtctggtctccgaagacggcagcatgaccaaggacgacctggccaactacatcgtctcgaacatgcaggacccgatctcgcgtaccgccggtgtgggtgacttccaggtgttcggtgcgcagtacgccatgcgtatctggctcgatccggccaagctgaacaagttccagctgaccccggtcgacgtcaagaccgctgtggccgcacagaacgtgcaggtgtcttccggccagctcggcggcctgccagccctgccgggcacccagctgaacgccaccatcatcggcaagacccgcctgcaaaccgccgagcagttcgagagcattctgctcaaggtcaacaaagacggttcacaggtgcgcctgggtgacgtcgcccaagtaggcctggggggtgaaaactacgccgtcagcgcccagttcaacggcaagccggcttccggcctggcggtaaaactggcaaccggcgccaacgccctggacaccgccaaggcactgcgcgagaccatcaaaggcctggaaccgttcttcccgccgggggtcaaggcggtattcccgtatgacaccacccccgtggtcaccgaatcgatcagcggcgtgatccacaccctgatcgaagccgtggtgctggtgttcctggtgctgtacctgttcctgcagaacttccgcgccaccatcatcaccaccatgaccgtgccggtcgtattgctgggtaccttcggtatccttgccgccgcgggcttcagcatcaacaccctgaccatgttcgccatggtcctggccatcggcttgctggtggacgacgccatcgtcgtggtggagaacgtcgagcgggtcatgtccgaagaaggcttgccgcccaaggaagcgaccaagcgctcgatggaacagatccagggcgccctggtgggtatcgccctggtgctctcggccgtactgctgcccatggcgttctttggcggctccacgggtgtgttctaccggcagttctccatcaccatcgtctcggccatgggcctgtcggtgctggttgcgcttatcttcaccccggcgctctgcgcgaccatgctcaaaccgctgaagaagggcgagcaccacaccgccaaaggcggcttcttcggctggttcaaccgcaacttcgaccgcagcgtcaacggctacgagcgtagcgtaggcaccatcctgcgcaacaaggtgccattcctgctggcctatgcgctgatcgtggtcggcatgatctggctgttcgcccgcatccctaccgcgttcctgccagaagaagaccagggcgtactgttcgctcaggtgcagaccccggccggttccagtgccgagcgcacgcaggtcgtggtcgaccagatgcgtgaatacctgctcaaggacgaagccgataccgtatcgtcggtgttcacggtcaacggtttcaacttcgcaggccgcggccagagctcaggcatggccttcatcatgctcaaaccctgggatgaacgctcgaaggagaacagcgtgttcgccctggcccagcgcgcccagcagcacttcttcaccttccgtgatgcgatggtgttcgccttcgccccgccagcggtgcttgaactgggtaacgccaccggcttcgacgtgttccttcaggaccgcggcggtgtcggccacgcgaagttgatggaggcacgcaaccagttcctggccaaagctgcgcagagcaagatcctcagcgccgtgcgcccgaacggcctgaacgatgaaccgcagtaccaactgaccattgatgacgaacgtgccagcgccttgggcgtgaccattgccgacatcaacaacaccctgtcgattgccttgggtgccagctacgtcaacgacttcatcgaccgtggccgggtcaagaaggtgtacatccagggcgaacccagcgcgcggatgagcccggaagacctgcaaaaatggtacgtgcgcaacggcgcaggcgagatggtgccgttctcctccttcgccaaaggcgaatggacctacggttcgccgaagctgtcgcgttacaacggtgtcgaagcgatggaaatcctcggtgcaccggcgcctggttacagtaccggtgaagccatggccgaggtcgagcgcattgcaggcgagctgccgagcggtatcggcttctcctggaccggcatgtcctacgaggaaaaactctccggctcgcagatgccggcgctgttcgccctcccggtgctgttcgtgttcctgtgcctggcggccctgtacgaaagctggtcgattccgatcgctgtggtgctggtggtaccgctgggtatcatcggtgcgctgatcgccaccagcctgcgcggcctgtccaacgacgtgtacttcctggttggcctgttgaccaccatcggtcttgcggcgaaaaacgccattttgatcgtggaattcgccaaggagctgcacgaacaaggccgtagcctgtacgacgcagcgatcgaagcgtgccgcatgcgtctgcgcccgatcatcatgacctcgctggcgttcatcctgggcgtggtgccgttgaccatcgccagcggcgccggcgccggcagccagcacgccatcggtactggcgtgatcggcggtatgatcagtgcgaccgtgctggctatcttctgggtaccactgttcttcgtcgcagtgtcgtcgctgttcggcagcaaagagccggaaaaagacgtcacccctgaaaatccacgttatgaggctgggcaatgaccaagtctttgttgtccctggcggtaaccgctttcattcttggcggctgctcgctgatccctgactaccagaccccagaggcgccggtggctgcacagtggccgcaaggccctgcatactcgccgacgcaatcggcggatgttgccgctgctgaacagggctggcgccagttcttccacgacccggcgctgcaacagctgatccagacctcgctggtcaataaccgcgacctgcgcgtcgcggcgttgaacctcgacgcctaccgtgcgcaataccgcattcagcgcgccgacctgttcccggcggtttcggccaccggcagcggcagccgccagcgtgtcccggcgaacatgtcgcaaacaggcgaatctggcatcaccagccagtactcggccaccttgggcgtcagcgcctacgagctggacctgttcggccgcgtgcgcagcctgaccgagcaggccctggaaacctacctctccagcgagcaggcgcgtcgttccacgcaaatcgccctggtcgccagcgtggccaacgcctactacacctggcaggccgaccaggccctgttcaagctgaccgaagaaacgctgaagacctacgaggaaagctacaacctcacccgtcgcagcaacgaggtcggcgtggcgtcggccttggacgtcagccaggcgcgtaccgccgtggaaggcgccagggtcaagtactcgcagtaccagcgcctggtcgcccaggacgtcaacagcctgaccgtgctgctgggcaccggcattcctgccgacctggccaagccgctggagcttgatgccgaccaactggccgaagtaccggccggcctgccatcggatatccttcagcgtcgcccggacattcaggaagccgagcacctgctcaaggctgccaacgccaacattggtgcagcccgcgcagcgttcttcccgagcatcagcctgaccgcgaacgccggcagcctgagccccgacatgggccacctgttcgcgggcggccagggcacctggctgttccagccgcagatcaacctgccgatcttcaacgccggtagcctgaaagccagcctggactactcgaaaatccagaaggacatcaacgtcgccaagtacgaaaaaaccatccagacggccttccaggaagtctccgatggcctggcggcacgcaagaccttcgaagagcagttgcaggcccagcgcgacctggtgcaggcgaaccaggactactaccgcttggccgaacgccgttaccgcatcgggattgacagcaacctgaccttcctcgatgcccaacgcaacctgttcagtgcccagcaagcgctgatcggcgaccgcctgtcgcagctgaccagcgaggtcaacctgtacaaggcgcttggcggtggctggtacgagcagaccgggcaggccaaccagcaggcatcggtggaaacaccgaaaggctgaggatccaaactcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctaggctacagccgatagtctggaacagcgcacttacgggttgctgcgcaacccaagtgctaccggcgcggcagcgtgacccgtgtcggcggctccaacggctcgccatcgtccagaaaacacggctcatcgggcatcggcaggcgctgctgcccgcgccgttcccattcctccgtttcggtcaaggctggcaggtctggttccatgcccggaatgccgggctggctgggcggctcctcgccggggccggtcggtagttgctgctcgcccggatacagggtcgggatgcggcgcaggtcgccatgccccaacagcgattcgtcctggtcgtcgtgatcaaccaccacggcggcactgaacaccgacaggcgcaactggtcgcggggctggccccacgccacgcggtcattgaccacgtaggccaacacggtgccggggccgttgagcttcacgacggagatccagcgctcggccaccaagtccttgactgcgtattggaccgtccgcaaagaacgtccgatgagcttggaaagtgtcttctggctgaccaccacggcgttctggtggcccatctgcgccacgaggtgatgcagcagcattgccgccgtgggtttcctcgcaataagcccggcccacgcctcatgcgctttgcgttccgtttgcacccagtgaccgggcttgttcttggcttgaatgccgatttctctggactgcgtggccatgcttatctccatgcggtaggggtgccgcacggttgcggcaccatgcgcaatcagctgcaacttttcggcagcgcgacaacaattatgcgttgcgtaaaagtggcagtcaattacagattttctttaacctacgcaatgagctattgcggggggtgccgcaatgagctgttgcgtaccccccttttttaagttgttgatttttaagtctttcgcatttcgccctatatctagttctttggtgcccaaagaagggcacccctgcggggttcccccacgccttcggcgcggctccccctccggcaaaaagtggcccctccggggcttgttgatcgactgcgcggccttcggccttgcccaaggtggcgctgcccccttggaacccccgcactcgccgccgtgaggctcggggggcaggcgggcgggcttcgcccttcgactgcccccactcgcataggcttgggtcgttccaggcgcgtcaaggccaagccgctgcgcggtcgctgcgcgagccttgacccgccttccacttggtgtccaaccggcaagcgaagcgcgcaggccgcaggccggaggcactagtgcttggattctcaccaataaaaaacgcccggcggcaaccgagcgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtccaagcgagctctcgaaccccagagtcccgctcagaagaactcgtcaagaaggcgatagaaggcgatgcgctgcgaatcgggagcggcgataccgtaaagcacgaggaagcggtcagcccattcgccgccaagctcttcagcaatatcacgggtagccaacgctatgtcctgatagcggtccgccacacccagccggccacagtcgatgaatccagaaaagcggccattttccaccatgatattcggcaagcaggcatcgccatgggtcacgacgagatcctcgccgtcgggcatgcgcgccttgagcctggcgaacagttcggctggcgcgagcccctgatgctcttcgtccagatcatcctgatcgacaagaccggcttccatccgagtacgtgctcgctcgatgcgatgtttcgcttggtggtcgaatgggcaggtagccggatcaagcgtatgcagccgccgcattgcatcagccatgatggatactttctcggcaggagcaaggtgagatgacaggagatcctgccccggcacttcgcccaatagcagccagtcccttcccgcttcagtgacaacgtcgagcacagctgcgcaaggaacgcccgtcgtggccagccacgatagccgcgctgcctcgtcctgcagttcattcagggcaccggacaggtcggtcttgacaaaaagaaccgggcgcccctgcgctgacagccggaacacggcggcatcagagcagccgattgtctgttgtgcccagtcatagccgaatagcctctccacccaagcggccggagaacctgcgtgcaatccatcttgttcaatcatgcgaaacgatcctcatcctgtctcttgatcagatcatgatcccctgcgccatcagatccttggcggcaagaaagccatccagtttactttgcagggcttcccaaccttaccagagggcgccccagctggcaattccgacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaattcaaaagatcttttaagaaggagatatacat",
// 	"circular": true,
// 	"extraLines": [
// 			"ACCESSION   pBbB8k-ttgABC-M355L-I466F-S878P (copy)",
// 			"VERSION     pBbB8k-ttgABC-M355L-I466F-S878P (copy).1",
// 			"KEYWORDS    ."
// 	],
// 	"comments": [],
// 	"type": "DNA",
// 	"size": 9525
// }

// export default {
// 	sequence: "atga",
// 	// features: {
// 	// 	asdf: {
// 	// 		start: 4, end: 7, id: "asdf"
// 	// 	},
// 	// 	asdfaa: {
// 	// 		start: 10, end: 10, id: "asdfaa"
// 	// 	}
// 	// }
// }

export default {
  parts: [
    {
      name: "pj5_00001",
      start: 0,
      end: 5298
    },
    {
      start: 10,
      end: 30,
      name: "Part 0",
      id: "0"
    }
  ],
  primers: [
    {
      name: "Example Primer 1",
      start: 280,
      end: 300,
      type: "primer",
      forward: true
    }
  ],
  features: [
    {
      notes: {},
      type: "CDS",
      strand: -1,
      name: "araC",
      start: 6,
      end: 884,
      locations: [
        { start: 6, end: 24 },
        { start: 28, end: 48 },
        { start: 500, end: 884 }
      ]
    },
    {
      notes: {},
      type: "protein_bind",
      strand: 1,
      name: "Operator I2 and I1",
      start: 1123,
      end: 1161
    },
    {
      notes: { vntifkey: ["4"] },
      type: "CDS",
      strand: 1,
      name: "signal_peptide",
      start: 1952,
      end: 2014
    },
    {
      notes: {},
      type: "terminator",
      strand: 1,
      name: "dbl term",
      start: 2033,
      end: 2161
    },
    {
      notes: {},
      type: "protein_bind",
      strand: 1,
      name: "operator O1",
      start: 1071,
      end: 1092
    },
    {
      notes: {},
      type: "misc_binding",
      strand: 1,
      name: "CAP site",
      start: 1114,
      end: 1127
    },
    {
      notes: {},
      type: "promoter",
      strand: 1,
      name: "pBAD promoter",
      start: 1160,
      end: 1187
    },
    {
      notes: { vntifkey: ["4"] },
      type: "CDS",
      strand: 1,
      name: "GFPuv",
      start: 1235,
      end: 2017
    },
    {
      notes: {},
      type: "misc_feature",
      strand: 1,
      name: "XhoI_silent_mutation",
      start: 1660,
      end: 1660
    },
    { notes: {}, type: "RBS", strand: 1, name: "RBS", start: 1215, end: 1234 },
    {
      notes: {},
      type: "protein_bind",
      strand: 1,
      name: "operator O2",
      start: 913,
      end: 930
    },
    {
      notes: {},
      type: "misc_feature",
      strand: 1,
      name: "BamHI_silent_mutation",
      start: 1759,
      end: 1759
    },
    {
      notes: {},
      type: "misc_marker",
      strand: -1,
      name: "CmR",
      start: 4513,
      end: 5172
    },
    {
      notes: {},
      type: "rep_origin",
      strand: -1,
      name: "pSC101**",
      start: 2163,
      end: 4391
    },
    {
      notes: {},
      type: "terminator",
      strand: 1,
      name: "T0",
      start: 4392,
      end: 4497
    },
    {
      notes: {},
      type: "promoter",
      strand: -1,
      name: "araE promoter",
      start: 1035,
      end: 1063
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""]
      },
      type: "misc_feature",
      strand: -1,
      name: "araD",
      start: 6,
      end: 884
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""],
        tag: ["terminator"]
      },
      type: "misc_feature",
      strand: 1,
      name: "dbl term",
      start: 2033,
      end: 2161
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""]
      },
      type: "misc_feature",
      strand: -1,
      name: "CmR",
      start: 4513,
      end: 5172
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""],
        tag: ["cds"]
      },
      type: "misc_feature",
      strand: 1,
      name: "GFPuv",
      start: 1241,
      end: 1951
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""]
      },
      type: "misc_feature",
      strand: -1,
      name: "pSC101**",
      start: 2163,
      end: 4391
    },
    {
      notes: {
        preferred5PrimeOverhangs: [""],
        preferred3PrimeOverhangs: [""]
      },
      type: "misc_feature",
      strand: 1,
      name: "pS8c-vector_backbone",
      start: 2015,
      end: 1237
    }
  ],
  name: "pj5_00001",
  sequence:
    "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaatttttaagaaggagatatacatatgagtaaaggagaagaacttttcactggagttgtcccaattcttgttgaattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgatgcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgtttttgcgtgagccatgagaacgaaccattgagatcatacttactttgcatgtcactcaaaaattttgcctcaaaactggtgagctgaatttttgcagttaaagcatcgtgtagtgtttttcttagtccgttatgtaggtaggaatctgatgtaatggttgttggtattttgtcaccattcatttttatctggttgttctcaagttcggttacgagatccatttgtctatctagttcaacttggaaaatcaacgtatcagtcgggcggcctcgcttatcaaccaccaatttcatattgctgtaagtgtttaaatctttacttattggtttcaaaacccattggttaagccttttaaactcatggtagttattttcaagcattaacatgaacttaaattcatcaaggctaatctctatatttgccttgtgagttttcttttgtgttagttcttttaataaccactcataaatcctcatagagtatttgttttcaaaagacttaacatgttccagattatattttatgaatttttttaactggaaaagataaggcaatatctcttcactaaaaactaattctaatttttcgcttgagaacttggcatagtttgtccactggaaaatctcaaagcctttaaccaaaggattcctgatttccacagttctcgtcatcagctctctggttgctttagctaatacaccataagcattttccctactgatgttcatcatctgagcgtattggttataagtgaacgataccgtccgttctttccttgtagggttttcaatcgtggggttgagtagtgccacacagcataaaattagcttggtttcatgctccgttaagtcatagcgactaatcgctagttcatttgctttgaaaacaactaattcagacatacatctcaattggtctaggtgattttaatcactataccaattgagatgggctagtcaatgataattactagtccttttcccgggtgatctgggtatctgtaaattctgctagacctttgctggaaaacttgtaaattctgctagaccctctgtaaattccgctagacctttgtgtgttttttttgtttatattcaagtggttataatttatagaataaagaaagaataaaaaaagataaaaagaatagatcccagccctgtgtataactcactactttagtcagttccgcagtattacaaaaggatgtcgcaaacgctgtttgctcctctacaaaacagaccttaaaaccctaaaggcttaagtagcaccctcgcaagctcgggcaaatcgctgaatattccttttgtctccgaccatcaggcacctgagtcgctgtctttttcgtgacattcagttcgctgcgctcacggctctggcagtgaatgggggtaaatggcactacaggcgccttttatggattcatgcaaggaaactacccataatacaagaaaagcccgtcacgggcttctcagggcgttttatggcgggtctgctatgtggtgctatctgactttttgctgttcagcagttcctgccctctgattttccagtctgaccacttcggattatcccgtgacaggtcattcagactggctaatgcacccagtaaggcagcggtatcatcaacaggcttacccgtcttactgtccctagtgcttggattctcaccaataaaaaacgcccggcggcaaccgagcgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtccaagcgagctcgatatcaaattacgccccgccctgccactcatcgcagtactgttgtaattcattaagcattctgccgacatggaagccatcacaaacggcatgatgaacctgaatcgccagcggcatcagcaccttgtcgccttgcgtataatatttgcccatggtgaaaacgggggcgaagaagttgtccatattggccacgtttaaatcaaaactggtgaaactcacccagggattggctgagacgaaaaacatattctcaataaaccctttagggaaataggccaggttttcaccgtaacacgccacatcttgcgaatatatgtgtagaaactgccggaaatcgtcgtggtattcactccagagcgatgaaaacgtttcagtttgctcatggaaaacggtgtaacaagggtgaacactatcccatatcaccagctcaccgtctttcattgccatacgaaattccggatgagcattcatcaggcgggcaagaatgtgaataaaggccggataaaacttgtgcttatttttctttacggtctttaaaaaggccgtaatatccagctgaacggtctggttataggtacattgagcaactgactgaaatgcctcaaaatgttctttacgatgccattgggatatatcaacggtggtatatccagtgatttttttctccattttagcttccttagctcctgaaaatctcgataactcaaaaaatacgcccggtagtgatcttatttcattatggtgaaagttggaacctcttacgtgccgatcaacgtctcattttcgccagatatc",
  date: "24-APR-2018",
  circular: true,
  // cutsiteLabelColors: { single: "#984d00", double: "#810000" , multi: "#797a00" },
  comments: [],
  teselagen_unique_id: "5adf735aa1811801e17d8aac",
  extraLines: [],
  type: "DNA",
  size: 5299
};
// export default generateSequenceData()

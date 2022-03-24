// export default {
//   sequence: 'aaa',
//   parts: [{name: 'hello there', start: 0,end:3, id: '1241i'}],
//   features: [{name: 'oh hi', start: 0,end:3, id: '12kkoo'}],
// }
export default {
  parts: [
    {
      name: "pj5_00001",
      start: 0,
      end: 5298,
      id: "10",
      tags: ["1:2", "5"]
    },
    {
      start: 10,
      end: 30,
      name: "Part 0",
      id: "0",
      tags: ["8"]
    },
    {
      start: 1000,
      end: 3000,
      name: "Curtis' Part",
      id: "9",
      tags: ["1:2", "5"]
    }
  ],
  primers: [
    {
      name: "Example Primer 1",
      start: 280,
      end: 300,
      type: "primer_bind",
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
      name: "CmR I'm a real long label",
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
  size: 5299,
  id: "jdosjio81"
};

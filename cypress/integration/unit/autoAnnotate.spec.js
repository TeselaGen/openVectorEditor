/* eslint-disable no-unused-expressions */
import {
  convertApELikeRegexToRegex,
  autoAnnotate
} from "../../../addons/AutoAnnotate/autoAnnotate";

describe("convertApELikeRegexToRegex", function () {
  it(`converts as expected`, () => {
    expect(convertApELikeRegexToRegex("TnC")).to.eq("T.C");
    expect(convertApELikeRegexToRegex("TNC")).to.eq("T.C");
    expect(convertApELikeRegexToRegex("TBC")).to.eq("T[CGT]C");
    expect(convertApELikeRegexToRegex("T#C")).to.eq("T[^T]*?C");
    expect(convertApELikeRegexToRegex("T#C<A")).to.eq("T?[^T]*?C?A");
    expect(convertApELikeRegexToRegex("T(GGGG)GC")).to.eq("TGGGGGC");
    expect(convertApELikeRegexToRegex("T(#)CC")).to.eq("T[^T]*?CC");
    expect(convertApELikeRegexToRegex("CA<ATT>TTGAG")).to.eq(
      "C?A?ATTT?T?G?A?G?"
    );
    expect(convertApELikeRegexToRegex("CA<ATTT")).to.eq("C?A?ATTT");
    expect(convertApELikeRegexToRegex("BA<ATTT")).to.eq("[CGT]?A?ATTT");
  });

  it(`errors as expected`, () => {
    try {
      convertApELikeRegexToRegex("T#C<");
    } catch (e) {
      expect(e).to.exist;
    }
  });
  it(`errors as expected`, () => {
    try {
      convertApELikeRegexToRegex("<C<");
    } catch (e) {
      expect(e).to.exist;
    }
  });
  it(`errors as expected`, () => {
    try {
      convertApELikeRegexToRegex(">C>");
    } catch (e) {
      expect(e).to.exist;
    }
  });
  it(`errors as expected`, () => {
    try {
      convertApELikeRegexToRegex(">C#");
    } catch (e) {
      expect(e).to.exist;
    }
  });
});
describe("autoAnnotate", function () {
  //   T#C
  // AAAATTTTGGGGGCCCCCAAGT
  // T(GGGG)GC
  // AAAATTTTGGGGGCCCCCAAGT
  // T(#)CC
  // AAAATTTTGGGGGCCCCCAAGT
  // CA<ATT>TTGAG
  // AAAATTTTGGGGGCCCCCAAGT
  // CA<ATTT
  // AAAATTTTGGGGGCCCCCAAGT
  it(`regexes work - correctly auto annotates a single seq with a regex annotation`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "AAAATTTTGGGGGCCCCCAAGT"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "TTTT.*CCC",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.not.be.undefined;
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        //21 = sequenceId
        //this is the list of new annotations to make
        {
          start: 4,
          end: 17,
          strand: 1,
          id: 31
        }
      ]
    });
  });
  it.only(`complex regex works - correctly auto annotates a single seq with a regex annotation`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaatttttaagaaggagatatacatatgagtaaaggagaagaacttttcactggagttgtcccaattcttgttgaattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgatgcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgtttttgcgtgagccatgagaacgaaccattgagatcatacttactttgcatgtcactcaaaaattttgcctcaaaactggtgagctgaatttttgcagttaaagcatcgtgtagtgtttttcttagtccgttatgtaggtaggaatctgatgtaatggttgttggtattttgtcaccattcatttttatctggttgttctcaagttcggttacgagatccatttgtctatctagttcaacttggaaaatcaacgtatcagtcgggcggcctcgcttatcaaccaccaatttcatattgctgtaagtgtttaaatctttacttattggtttcaaaacccattggttaagccttttaaactcatggtagttattttcaagcattaacatgaacttaaattcatcaaggctaatctctatatttgccttgtgagttttcttttgtgttagttcttttaataaccactcataaatcctcatagagtatttgttttcaaaagacttaacatgttccagattatattttatgaatttttttaactggaaaagataaggcaatatctcttcactaaaaactaattctaatttttcgcttgagaacttggcatagtttgtccactggaaaatctcaaagcctttaaccaaaggattcctgatttccacagttctcgtcatcagctctctggttgctttagctaatacaccataagcattttccctactgatgttcatcatctgagcgtattggttataagtgaacgataccgtccgttctttccttgtagggttttcaatcgtggggttgagtagtgccacacagcataaaattagcttggtttcatgctccgttaagtcatagcgactaatcgctagttcatttgctttgaaaacaactaattcagacatacatctcaattggtctaggtgattttaatcactataccaattgagatgggctagtcaatgataattactagtccttttcccgggtgatctgggtatctgtaaattctgctagacctttgctggaaaacttgtaaattctgctagaccctctgtaaattccgctagacctttgtgtgttttttttgtttatattcaagtggttataatttatagaataaagaaagaataaaaaaagataaaaagaatagatcccagccctgtgtataactcactactttagtcagttccgcagtattacaaaaggatgtcgcaaacgctgtttgctcctctacaaaacagaccttaaaaccctaaaggcttaagtagcaccctcgcaagctcgggcaaatcgctgaatattccttttgtctccgaccatcaggcacctgagtcgctgtctttttcgtgacattcagttcgctgcgctcacggctctggcagtgaatgggggtaaatggcactacaggcgccttttatggattcatgcaaggaaactacccataatacaagaaaagcccgtcacgggcttctcagggcgttttatggcgggtctgctatgtggtgctatctgactttttgctgttcagcagttcctgccctctgattttccagtctgaccacttcggattatcccgtgacaggtcattcagactggctaatgcacccagtaaggcagcggtatcatcaacaggcttacccgtcttactgtccctagtgcttggattctcaccaataaaaaacgcccggcggcaaccgagcgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtccaagcgagctcgatatcaaattacgccccgccctgccactcatcgcagtactgttgtaattcattaagcattctgccgacatggaagccatcacaaacggcatgatgaacctgaatcgccagcggcatcagcaccttgtcgccttgcgtataatatttgcccatggtgaaaacgggggcgaagaagttgtccatattggccacgtttaaatcaaaactggtgaaactcacccagggattggctgagacgaaaaacatattctcaataaaccctttagggaaataggccaggttttcaccgtaacacgccacatcttgcgaatatatgtgtagaaactgccggaaatcgtcgtggtattcactccagagcgatgaaaacgtttcagtttgctcatggaaaacggtgtaacaagggtgaacactatcccatatcaccagctcaccgtctttcattgccatacgaaattccggatgagcattcatcaggcgggcaagaatgtgaataaaggccggataaaacttgtgcttatttttctttacggtctttaaaaaggccgtaatatccagctgaacggtctggttataggtacattgagcaactgactgaaatgcctcaaaatgttctttacgatgccattgggatatatcaacggtggtatatccagtgatttttttctccattttagcttccttagctcctgaaaatctcgataactcaaaaaatacgcccggtagtgatcttatttcattatggtgaaagttggaacctcttacgtgccgatcaacgtctcattttcgccagatatc"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "T?A?A?A?A?C?A?A?G?A?A?G?A?G?G?G?T?T?G?A?C?T?A?C?A?T?C?A?C?G?A?T?G?A?G?G?G?G?G?A?T?C?G?A?A?G?A?A?A?T?G?A?T?G?G?T?A?A?A?T?G?A?A?A?T?A?G?G?A?A?A?T?C?A?A?G?G?A?G?C?A?T?G?A?A?G?G?C?A?A?A?A?G?A?C?A?A?A?T?A?T?A?A?G?G?G?T?C?G?A?A?C?G?A?A?A?A?A?T?A?A?A?G?T?G?A?A?A?A?G?T?G?T?T?G?A?T?A?T?G?A?T?G?T?A?T?T?T?G?G?C?T?T?T?G?C?G?G?C?G?C?C?G?A?A?A?A?A?A?C?G?A?G?T?T?T?A?C?G?C?A?A?T?T?G?C?A?C?A?A?T?C?A?T?G?C?T?G?A?C?T?C?T?G?T?G?G?C?G?G?A?C?C?C?G?C?G?C?T?C?T?T?G?C?C?G?G?C?C?C?G?G?C?G?A?T?A?A?C?G?C?T?G?G?G?C?G?T?G?A?G?G?C?T?G?T?G?C?C?C?G?G?C?G?G?A?G?T?T?T?T?T?T?G?C?G?C?C?T?G?C?A?T?T?T?T?C?C?A?A?G?G?T?T?T?A?C?C?C?T?G?C?G?C?T?A?A?G?G?G?G?C?G?A?G?A?T?T?G?G?A?G?A?A?G?C?A?A?T?A?A?G?A?A?T?G?C?C?G?G?T?T?G?G?G?G?T?T?G?C?G?A?T?G?A?T?G?A?C?G?A?C?C?A?C?G?A?C?A?A?C?T?G?G?T?G?T?C?A?T?T?A?T?T?T?A?A?G?T?T?G?C?C?G?A?A?A?G?A?A?C?C?T?G?A?G?T?G?C?A?T?T?T?G?C?A?A?C?A?T?G?A?G?T?A?T?A?C?T?A?G?A?A?G?A?A?T?G?A?G?C?C?A?A?G?A?C?T?T?G?C?G?A?G?A?C?G?C?G?A?G?T?T?T?G?C?C?G?G?T?G?G?T?G?C?G?A?A?C?A?A?T?A?G?A?G?C?G?A?C?C?A?T?G?A?C?C?T?T?G?A?A?G?G?T?G?A?G?A?C?G?C?G?C?A?T?A?A?C?C?G?C?T?A?G?A?G?T?A?C?T?T?T?G?A?A?G?A?G?G?A?A?A?C?A?G?C?A?A?T?A?G?G?G?T?T?G?C?T?A?C?C?A?G?T?A?T?A?A?A?T?A?G?A?C?A?G?G?T?A?C?A?T?A?C?A?A?C?A?C?T?G?G?A?A?A?T?G?G?T?T?G?T?C?T?G?T?T?T?G?A?G?T?A?C?G?C?T?T?T?C?A?A?T?T?C?A?T?T?T?G?G?G?T?G?T?G?C?A?C?T?T?T?A?T?T?A?T?G?T?T?A?C?A?A?T?A?T?G?G?A?A?G?G?G?A?A?C?T?T?T?A?C?A?C?T?T?C?T?C?C?T?A?T?G?C?A?C?A?T?A?T?A?T?T?A?A?T?T?A?A?A?G?T?C?C?A?A?T?G?C?T?A?G?T?A?G?A?G?A?A?G?G?G?G?G?G?T?A?A?C?A?C?C?C?C?T?C?C?G?C?G?C?T?C?T?T?T?T?C?C?G?A?T?T?T?T?T?T?T?C?T?A?A?A?C?C?G?T?G?G?A?A?T?A?T?T?T?C?G?G?A?T?A?T?C?C?T?T?T?T?G?T?T?G?T?T?T?C?C?G?G?G?T?G?T?A?C?A?A?T?A?T?G?G?A?C?T?T?C?C?T?C?T?T?T?T?C?T?G?G?C?A?A?C?C?A?A?A?C?C?C?A?T?A?C?A?T?C?G?G?G?A?T?T?C?C?T?A?T?A?A?T?A?C?C?T?T?C?G?T?T?G?G?T?C?T?C?C?C?T?A?A?C?A?T?G?T?A?G?G?T?G?G?C?G?G?A?G?G?G?G?A?G?A?T?A?T?A?C?A?A?T?A?G?A?A?C?A?G?A?T?A?C?C?A?G?A?C?A?A?G?A?C?A?T?A?A?T?G?G?G?C?T?A?A?A?C?A?A?G?A?C?T?A?C?A?C?C?A?A?T?T?A?C?A?C?T?G?C?C?T?C?A?T?T?G?A?T?G?G?T?G?G?T?A?C?A?T?A?A?C?G?A?A?C?T?A?A?T?A?C?T?G?T?A?G?C?C?C?T?A?G?A?C?T?T?G?A?T?A?G?C?C?A?T?C?A?T?C?A?T?A?T?C?G?A?A?G?T?T?T?C?A?C?T?A?C?C?C?T?T?T?T?T?C?C?A?T?T?T?G?C?C?A?T?C?T?A?T?T?G?A?A?G?T?A?A?T?A?A?T?A?G?G?C?GCATGCAACTTCTTTTCTTTTTTTTTCTTTTCTCTCTCCCCCGTTGTTGTCTCACCATATCCGCAATGAC[^C]*?AAAAAAATGATGGAAGACACTAAAGGAAAAAATTAACGACAAAGACAGCACCAACAGATGTCGTTGTTCCAGAGCTGATGAGGGGTATCT.....CACACGAAACTTTTTCCTTCCTTCATT[^T]*?GACCTGCAATTATTAATCTTTTGTTTCCTCGTCATTGTTCTCGTTCCCTTTCTTCCTTGTTTCTTTTTCTGCACAATATTTCAAGCTATACCAAGCATACAA",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.not.be.undefined;
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        //21 = sequenceId
        //this is the list of new annotations to make
        {
          start: 4,
          end: 17,
          strand: 1,
          id: 31
        }
      ]
    });
  });

  it(`correctly auto annotates a single seq with a single annotation`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence:
            "gatgttgattctatcatctatctggccagatagatgatagaatcgagcatcgattctatcatctatctgtactatcgattctatcatctatctga",
          //   tcagatagatgatagaatcgatagtacagatagatgatagaatcgatgctcgattctatcatctatctggccagatagatgatagaatcaacatc
          annotations: [
            {
              start: 5,
              end: 11
            }
          ]
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "gattctatcatctatctg", //cagatagatgatagaatc <-- rev comp
          name: "ann1",
          type: "misc_feature"
        }
      }
    });

    expect(results).to.not.be.undefined;
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        //21 = sequenceId
        //this is the list of new annotations to make
        {
          start: 6,
          end: 23,
          strand: 1,
          id: 31
        },
        {
          start: 26,
          end: 43,
          strand: -1,
          id: 31
        },
        {
          start: 51,
          end: 68,
          strand: 1,
          id: 31
        },
        {
          start: 76,
          end: 93,
          strand: 1,
          id: 31
        }
      ]
    });
  });
  it(`correctly auto annotates a single seq with a full spanning annotation`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "ttttttt"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "ttttttt",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [{ id: 31, strand: 1, start: 0, end: 6 }]
    });
  });
  it(`a "warning threshold" works as expected`, () => {
    const results = autoAnnotate({
      warnIfMoreThan: 5,
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "ttttttt"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "t",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        {
          start: 0,
          end: 0,
          strand: 1,
          id: 31
        },
        {
          start: 1,
          end: 1,
          strand: 1,
          id: 31
        },
        {
          start: 2,
          end: 2,
          strand: 1,
          id: 31
        },
        {
          start: 3,
          end: 3,
          strand: 1,
          id: 31
        },
        {
          start: 4,
          end: 4,
          strand: 1,
          id: 31
        },
        {
          start: 5,
          end: 5,
          strand: 1,
          id: 31
        },
        {
          start: 6,
          end: 6,
          strand: 1,
          id: 31
        }
      ],
      __more_than_warnings: {
        21: ["31"]
      }
    });
  });
  it(`correctly does not auto annotate two seqs when an annotation spans them`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "ttttttt"
        },
        22: {
          id: 22,
          sequence: "aaaaaaa"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "tttaaa",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({});
  });
  it(`correctly auto annotates two seqs when an annotation spans the origin on the 2nd seq`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "ttttttt"
        },
        22: {
          circular: true,
          id: 22,
          sequence: "aaaaaaaattg"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "attga",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.deep.eq({
      22: [
        {
          start: 7,
          end: 0,
          strand: 1,
          id: 31
        }
      ]
    });
  });
  it(`correctly auto annotates two seq when the casing on the annotation and seq is wonky`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "ttttTtt"
        },
        22: {
          circular: true,
          id: 22,
          sequence: "aAaaaaaaTtg"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "atTgA",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      22: [
        {
          id: 31,
          strand: 1,
          start: 7,
          end: 0
        }
      ]
    });
  });

  it(`correctly auto annotates a 1 bp seq`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "t"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "t",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        {
          id: 31,
          strand: 1,
          start: 0,
          end: 0
        }
      ]
    });
  });
  it(`correctly does not auto annotate a 1 bp seq when a feature already spans that seq`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "t",
          annotations: [{ start: 0, end: 0 }]
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "t",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({});
  });
  it(`correctly auto annotates a 1 bp seq when compareName:true when a feature with a different name already spans that seq`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "t",
          annotations: [{ start: 0, end: 0, name: "someothername" }]
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "t",
          name: "ann1",
          type: "misc_feature"
        }
      },
      compareName: true
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        {
          id: 31,
          strand: 1,
          start: 0,
          end: 0
        }
      ]
    });
  });
  it(`correctly does not auto annotate several seqs when annotations already span those seqs`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "t",
          annotations: [{ start: 0, end: 0, strand: 1 }]
        },
        22: {
          circular: true,
          id: 22,
          sequence: "gggggt",
          annotations: [
            { start: 3, end: 5 },
            { start: 5, end: 5 }
          ]
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "t",
          name: "ann1",
          type: "misc_feature"
        },
        32: {
          id: 32,
          sequence: "ggt",
          name: "ann2",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({});
  });
  it(`correctly auto annotates two seqs when a annotation spans the origin on the 2nd seq on the negative strand`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          circular: true,
          id: 21,
          sequence: "ttttttt"
        },
        22: {
          circular: true, //
          id: 22, //01234567890
          //caat      t
          sequence: "aaaaaaaattg" //caatttttttt
          //aaaaaaaattg
          //a      attg
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "tcaat",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      22: [
        {
          id: 31,
          strand: -1,
          start: 7,
          end: 0
        }
      ]
    });
  });
  it(`correctly auto annotates a seq when an annotation matches multiple times overlapping`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        22: {
          id: 22,
          sequence: "aaaaa"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "aaaa",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.deep.eq({
      22: [
        {
          id: 31,
          strand: 1,
          start: 0,
          end: 3
        },
        {
          id: 31,
          strand: 1,
          start: 1,
          end: 4
        }
      ]
    });
  });
  it(`correctly auto annotates two seqs when an annotation matches multiple times overlapping on the 2nd seq`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        20: {
          id: 20,
          sequence: "aaaagg"
        },
        22: {
          id: 22,
          sequence: "aaaaa"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "aaaa",
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.deep.eq({
      20: [
        {
          id: 31,
          strand: 1,
          start: 0,
          end: 3
        }
      ],
      22: [
        {
          id: 31,
          strand: 1,
          start: 0,
          end: 3
        },
        {
          id: 31,
          strand: 1,
          start: 1,
          end: 4
        }
      ]
    });
  });
  it(`correctly auto annotates multiple sequences and multiple annotations`, () => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "gatgttgattctatcatctatctggcgagcatctactatca",
          annotations: [
            {
              strand: -1, //this annotation should not be matched cause it is on the reverse strand!
              start: 5,
              end: 11
            }
          ]
        },
        45: {
          id: 45,
          circular: true,
          sequence:
            "gatgttgattctatcgtttttttttttaaaaaaagatgttgattctatcgtttttttttttaaaaaaactggcgagcatctactatca"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: "ttttttttttaaaaa" //tttttaaaaaaaaaa
        },
        84: {
          id: 84,
          sequence: "tgattct", //agaatca
          name: "zoink1"
        },
        90: {
          id: 90,
          sequence: "ctatcagatgttg" //crosses the origin on seq45 //caacatctgatag
        },
        91: {
          id: 91,
          sequence: "ctcgccagatagatga" //tcatctatctggcgag revcomp on 21
        }
      }
    });
    expect(results).to.not.be.undefined;
    expect(results).to.deep.eq({
      21: [
        {
          strand: 1,
          start: 5,
          end: 11,
          id: 84
        },
        {
          strand: -1,
          start: 13,
          end: 28,
          id: 91
        }
      ],
      45: [
        {
          strand: 1,
          start: 5,
          end: 11,
          id: 84
        },
        {
          strand: 1,
          start: 17,
          end: 31,
          id: 31
        },
        {
          strand: 1,
          start: 39,
          end: 45,
          id: 84
        },
        {
          strand: 1,
          start: 51,
          end: 65,
          id: 31
        },
        {
          strand: 1,
          start: 82,
          end: 6,
          id: 90
        }
      ]
    });
  });
});

/* eslint-disable no-unused-expressions */
import {
  convertApELikeRegexToRegex,
  autoAnnotate
} from "../../../addons/AutoAnnotate/autoAnnotate";

describe("convertApELikeRegexToRegex", function () {
  it(`converts as expected`, (done) => {
    expect(convertApELikeRegexToRegex("TnC")).to.eq("T.C");
    expect(convertApELikeRegexToRegex("TNC")).to.eq("T.C");
    expect(convertApELikeRegexToRegex("TBC")).to.eq("T[CGT]C");
    expect(convertApELikeRegexToRegex("T#C")).to.eq("T[^T]*?C");
    expect(convertApELikeRegexToRegex("T#C<A")).to.eq("(T[^T]*?C|[^T]*?C|C)?A");
    expect(convertApELikeRegexToRegex("T(GGGG)GC")).to.eq("TGGGGGC");
    expect(convertApELikeRegexToRegex("T(#)CC")).to.eq("T[^T]*?CC");
    expect(convertApELikeRegexToRegex("CA<ATT>TTGAG")).to.eq(
      "(CA|A)?ATT(TTGAG|TTGA|TTG|TT|T)?"
    );
    expect(convertApELikeRegexToRegex("CAA>AT")).to.eq("CAA(AT|A)?");
    expect(convertApELikeRegexToRegex("CAA>ATT")).to.eq("CAA(ATT|AT|A)?");
    expect(convertApELikeRegexToRegex("CAA>TBT")).to.eq(
      "CAA(T[CGT]T|T[CGT]|T)?"
    );
    expect(convertApELikeRegexToRegex("CA<ATTT")).to.eq("(CA|A)?ATTT");
    expect(convertApELikeRegexToRegex("NA<ATTT")).to.eq("(.A|A)?ATTT");
    expect(convertApELikeRegexToRegex("BA<ATTT")).to.eq("([CGT]A|A)?ATTT");
    expect(convertApELikeRegexToRegex("CATTT<ATTT")).to.eq(
      "(CATTT|ATTT|TTT|TT|T)?ATTT"
    );
    done();
  });

  it(`errors as expected`, (done) => {
    try {
      convertApELikeRegexToRegex("T#C<");
    } catch (e) {
      expect(e).to.exist;
    }
    done();
  });
  it(`errors as expected`, (done) => {
    try {
      convertApELikeRegexToRegex("<C<");
    } catch (e) {
      expect(e).to.exist;
    }
    done();
  });
  it(`errors as expected`, (done) => {
    try {
      convertApELikeRegexToRegex(">C>");
    } catch (e) {
      expect(e).to.exist;
    }
    done();
  });
  it(`errors as expected`, (done) => {
    try {
      convertApELikeRegexToRegex(">C#");
    } catch (e) {
      expect(e).to.exist;
    }
    done();
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
  it(`regexes work - correctly auto annotates a single seq with a regex annotation`, (done) => {
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
    done();
  });
  it(`IUPAC # works - T#C should capture part of AAAATTTTGGGGGCCCCCAAGT`, (done) => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "AAAATTTTGGGGGCCCCCAAGT"
          //        "ACTTGGGGGCCCCCAAAATTTT"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertApELikeRegexToRegex("T#C"),
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
          start: 7,
          end: 13,
          strand: 1,
          id: 31
        },
        {
          start: 12,
          end: 18,
          strand: -1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`IUPAC # works - T#C<AAG should capture part of AAAATTTTGGGGGCCCCCAAGT`, (done) => {
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
          sequence: convertApELikeRegexToRegex("T#C<AAG"),
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
          start: 7,
          end: 20,
          strand: 1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`IUPAC > works - CAA>ATT should capture all of CAAATT`, (done) => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "CAAATT"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertApELikeRegexToRegex("CAA>ATT"),
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
          start: 0,
          end: 5,
          strand: 1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`IUPAC > works - CAA>ATT should capture part of CAAATG`, (done) => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "CAAATT"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertApELikeRegexToRegex("CAA>ATT"),
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
          start: 0,
          end: 5,
          strand: 1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`complex IUPAC works - correctly auto annotates a single seq with a regex annotation`, (done) => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "CGCATATTT"
        }
      },
      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertApELikeRegexToRegex("CCAT<ATTT"),
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
          start: 2,
          end: 8,
          strand: 1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`another IUPAC works ccc<cTTT - correctly auto annotates a single seq with a regex annotation`, (done) => {
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence: "ccccccTTT"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertApELikeRegexToRegex("ccc<cTTT"),
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
          start: 2,
          end: 8,
          strand: 1,
          id: 31
        }
      ]
    });
    done();
  });
  it(`long iupac < works - correctly auto annotates a single seq with a regex annotation`, (done) => {
    const convertReg = convertApELikeRegexToRegex(
      "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtc<ctcgc"
    );
    const results = autoAnnotate({
      seqsToAnnotateById: {
        21: {
          id: 21,
          sequence:
            "gacgtcttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccatacttttcatactcccgccattcagagaagaaaccaattgtccatattgcatcagacattgccgtcactgcgtcttttactggctcttctcgctaaccaaaccggtaaccccgcttattaaaagcattctgtaacaaagcgggaccaaagccatgacaaaaacgcgtaacaaaagtgtctataatcacggcagaaaagtccacattgattatttgcacggcgtcacactttgctatgccatagcatttttatccataagattagcggattctacctgacgctttttatcgcaactctctactgtttctccatacccgtttttttgggaatttttaagaaggagatatacatatgagtaaaggagaagaacttttcactggagttgtcccaattcttgttgaattagatggtgatgttaatgggcacaaattttctgtcagtggagagggtgaaggtgatgcaacatacggaaaacttacccttaaatttatttgcactactggaaaactacctgttccatggccaacacttgtcactactttctcttatggtgttcaatgcttttcccgttatccggatcatatgaaacggcatgactttttcaagagtgccatgcccgaaggttatgtacaggaacgcactatatctttcaaagatgacgggaactacaagacgcgtgctgaagtcaagtttgaaggtgatacccttgttaatcgtatcgagttaaaaggtattgattttaaagaagatggaaacattctcggacacaaactcgaatacaactataactcacacaatgtatacatcacggcagacaaacaaaagaatggaatcaaagctaacttcaaaattcgccacaacattgaagatggatctgttcaactagcagaccattatcaacaaaatactccaattggcgatggccctgtccttttaccagacaaccattacctgtcgacacaatctgccctttcgaaagatcccaacgaaaagcgtgaccacatggtccttcttgagtttgtaactgctgctgggattacacatggcatggatgagctcggcggcggcggcagcaaggtctacggcaaggaacagtttttgcggatgcgccagagcatgttccccgatcgctaaatcgagtaaggatctccaggcatcaaataaaacgaaaggctcagtcgaaagactgggcctttcgttttatctgttgtttgtcggtgaacgctctctactagagtcacactggctcaccttcgggtgggcctttctgcgtttatacctagggtacgggttttgctgcccgcaaacgggctgttctggtgttgctagtttgttatcagaatcgcagatccggcttcagccggtttgccggctgaaagcgctatttcttccagaattgccatgattttttccccacgggaggcgtcactggctcccgtgttgtcggcagctttgattcgataagcagcatcgcctgtttcaggctgtctatgtgtgactgttgagctgtaacaagttgtctcaggtgttcaatttcatgttctagttgctttgttttactggtttcacctgttctattaggtgttacatgctgttcatctgttacattgtcgatctgttcatggtgaacagctttgaatgcaccaaaaactcgtaaaagctctgatgtatctatcttttttacaccgttttcatctgtgcatatggacagttttccctttgatatgtaacggtgaacagttgttctacttttgtttgttagtcttgatgcttcactgatagatacaagagccataagaacctcagatccttccgtatttagccagtatgttctctagtgtggttcgttgtttttgcgtgagccatgagaacgaaccattgagatcatacttactttgcatgtcactcaaaaattttgcctcaaaactggtgagctgaatttttgcagttaaagcatcgtgtagtgtttttcttagtccgttatgtaggtaggaatctgatgtaatggttgttggtattttgtcaccattcatttttatctggttgttctcaagttcggttacgagatccatttgtctatctagttcaacttggaaaatcaacgtatcagtcgggcggcctcgcttatcaaccaccaatttcatattgctgtaagtgtttaaatctttacttattggtttcaaaacccattggttaagccttttaaactcatggtagttattttcaagcattaacatgaacttaaattcatcaaggctaatctctatatttgccttgtgagttttcttttgtgttagttcttttaataaccactcataaatcctcatagagtatttgttttcaaaagacttaacatgttccagattatattttatgaatttttttaactggaaaagataaggcaatatctcttcactaaaaactaattctaatttttcgcttgagaacttggcatagtttgtccactggaaaatctcaaagcctttaaccaaaggattcctgatttccacagttctcgtcatcagctctctggttgctttagctaatacaccataagcattttccctactgatgttcatcatctgagcgtattggttataagtgaacgataccgtccgttctttccttgtagggttttcaatcgtggggttgagtagtgccacacagcataaaattagcttggtttcatgctccgttaagtcatagcgactaatcgctagttcatttgctttgaaaacaactaattcagacatacatctcaattggtctaggtgattttaatcactataccaattgagatgggctagtcaatgataattactagtccttttcccgggtgatctgggtatctgtaaattctgctagacctttgctggaaaacttgtaaattctgctagaccctctgtaaattccgctagacctttgtgtgttttttttgtttatattcaagtggttataatttatagaataaagaaagaataaaaaaagataaaaagaatagatcccagccctgtgtataactcactactttagtcagttccgcagtattacaaaaggatgtcgcaaacgctgtttgctcctctacaaaacagaccttaaaaccctaaaggcttaagtagcaccctcgcaagctcgggcaaatcgctgaatattccttttgtctccgaccatcaggcacctgagtcgctgtctttttcgtgacattcagttcgctgcgctcacggctctggcagtgaatgggggtaaatggcactacaggcgccttttatggattcatgcaaggaaactacccataatacaagaaaagcccgtcacgggcttctcagggcgttttatggcgggtctgctatgtggtgctatctgactttttgctgttcagcagttcctgccctctgattttccagtctgaccacttcggattatcccgtgacaggtcattcagactggctaatgcacccagtaaggcagcggtatcatcaacaggcttacccgtcttactgtccctagtgcttggattctcaccaataaaaaacgcccggcggcaaccgagcgttctgaacaaatccagatggagttctgaggtcattactggatctatcaacaggagtccaagcgagctcgatatcaaattacgccccgccctgccactcatcgcagtactgttgtaattcattaagcattctgccgacatggaagccatcacaaacggcatgatgaacctgaatcgccagcggcatcagcaccttgtcgccttgcgtataatatttgcccatggtgaaaacgggggcgaagaagttgtccatattggccacgtttaaatcaaaactggtgaaactcacccagggattggctgagacgaaaaacatattctcaataaaccctttagggaaataggccaggttttcaccgtaacacgccacatcttgcgaatatatgtgtagaaactgccggaaatcgtcgtggtattcactccagagcgatgaaaacgtttcagtttgctcatggaaaacggtgtaacaagggtgaacactatcccatatcaccagctcaccgtctttcattgccatacgaaattccggatgagcattcatcaggcgggcaagaatgtgaataaaggccggataaaacttgtgcttatttttctttacggtctttaaaaaggccgtaatatccagctgaacggtctggttataggtacattgagcaactgactgaaatgcctcaaaatgttctttacgatgccattgggatatatcaacggtggtatatccagtgatttttttctccattttagcttccttagctcctgaaaatctcgataactcaaaaaatacgcccggtagtgatcttatttcattatggtgaaagttggaacctcttacgtgccgatcaacgtctcattttcgccagatatc"
        }
      },

      annotationsToCheckById: {
        31: {
          id: 31,
          sequence: convertReg,
          name: "ann1",
          type: "misc_feature"
        }
      }
    });
    expect(results).to.not.be.undefined;
    //this should return an object keyed by the sequence id with the list of annotations to create
    expect(results).to.deep.eq({
      21: [
        {
          start: 0,
          end: 205,
          strand: 1,
          id: 31
        },
        {
          start: 98,
          end: 102,
          strand: -1,
          id: 31
        },
        {
          start: 341,
          end: 346,
          strand: 1,
          id: 31
        },
        {
          start: 618,
          end: 622,
          strand: -1,
          id: 31
        },
        {
          start: 972,
          end: 976,
          strand: 1,
          id: 31
        },
        {
          start: 3002,
          end: 3007,
          strand: 1,
          id: 31
        },
        {
          start: 4006,
          end: 4011,
          strand: 1,
          id: 31
        },
        {
          start: 4496,
          end: 4500,
          strand: -1,
          id: 31
        }
      ]
    });
    done();
  });

  it(`correctly auto annotates a single seq with a single annotation`, (done) => {
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
    done();
  });
  it(`correctly auto annotates a single seq with a full spanning annotation`, (done) => {
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
    done();
  });
  it(`a "warning threshold" works as expected`, (done) => {
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
    done();
  });
  it(`correctly does not auto annotate two seqs when an annotation spans them`, (done) => {
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
    done();
  });
  it(`correctly auto annotates two seqs when an annotation spans the origin on the 2nd seq`, (done) => {
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
    done();
  });
  it(`correctly auto annotates two seq when the casing on the annotation and seq is wonky`, (done) => {
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
    done();
  });

  it(`correctly auto annotates a 1 bp seq`, (done) => {
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
    done();
  });
  it(`correctly does not auto annotate a 1 bp seq when a feature already spans that seq`, (done) => {
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
    done();
  });
  it(`correctly auto annotates a 1 bp seq when compareName:true when a feature with a different name already spans that seq`, (done) => {
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
    done();
  });
  it(`correctly does not auto annotate several seqs when annotations already span those seqs`, (done) => {
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
    done();
  });
  it(`correctly auto annotates two seqs when a annotation spans the origin on the 2nd seq on the negative strand`, (done) => {
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
    done();
  });
  it(`correctly auto annotates a seq when an annotation matches multiple times overlapping`, (done) => {
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
    done();
  });
  it(`correctly auto annotates two seqs when an annotation matches multiple times overlapping on the 2nd seq`, (done) => {
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
    done();
  });
  it(`correctly auto annotates multiple sequences and multiple annotations`, (done) => {
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
    done();
  });
});

const exampleEditorState = {
  sequenceData: {
    sequence:
      "gagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggggagtagagcactacgactgcatcgactacgactacgactacgactacggcgcgcgcggcggggggggattatatttttttatcattcctcccccccctcttctttatatatataggagggaggggaaatatatattcttcgatcgatatatatagagagggcccctataaatatttttaaaggg",
    circular: true,
    sequenceFileName: "pj5_00001.gb",
    name: "pj5_00001",
    size: 8832,
    description: "",
    translations: {
      "55a4a061f0c5b500012a8qqqq": {
        name: "Operator I2 and I1",
        type: "protein_bind",
        id: "55a4a061f0c5b500012a8qqqq",
        start: 1123,
        end: 1162,
        strand: 1,
        notes: [],
        forward: true,
        annotationType: "translation"
      },
      "55a4a061f0c5b500312340a8qqqq": {
        name: "pBAD promoter",
        type: "promoter",
        id: "55a4a061f0c5b500312340a8qqqq",
        start: 1163,
        end: 1188,
        strand: 1,
        notes: [],
        forward: true,
        annotationType: "translation"
      }
    },
    features: {
      "55a4a061f0c5b50asd00a8bfaf5": {
        name: "Operator I2 and I1",
        type: "protein_bind",
        id: "55a4a061f0c5b50asd00a8bfaf5",
        start: 4,
        end: 20,
        locations: [{start: 4, end: 6}, {start: 15, end: 20}],
        strand: 1,
        notes: [],
        color: "#BBBBBB",
        forward: true,
        annotationType: "feature"
      },
      "55a4a061f0c5b5000a8bfaf8": {
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
        ],
        color: "#BBBBBB",
        forward: true,
        annotationType: "feature"
      },
    },
    parts: {},
    primers: {},
    fromFileUpload: false
  },
  annotationLabelVisibility: {
    features: true,
    parts: true,
    cutsites: true
  },
  annotationVisibility: {
    features: true,
    translations: true,
    parts: true,
    orfs: false,
    orfTranslations: false,
    cdsFeatureTranslations: true,
    axis: true,
    cutsites: true,
    reverseSequence: true
  },
  annotationsToSupport: { 
    features: true,
    translations: true,
    parts: true,
    orfs: true,
    cutsites: true,
    primers: true,
  },
  panelsShown: [
    [
      {
        id: "sequence",
        name: "Sequence Map",
        active: true
      }
    ],
    [
      {
        id: "circular",
        name: "Circular",
        active: true
      },
      {
        id: "rail",
        name: "Linear",
        active: false
      },
      {
        id: "properties",
        name: "Properties",
        active: false
      }
    ]
  ],
  restrictionEnzymes: {
    filteredRestrictionEnzymes: [
      {
        value: "single",
        label: "Single cutters",
        cutsThisManyTimes: 1
      }
    ],
    allRestrictionEnzymes: {
      aatii: {
        name: "AatII",
        site: "gacgtc",
        forwardRegex: "gacgtc",
        reverseRegex: "gacgtc",
        topSnipOffset: 5,
        bottomSnipOffset: 1,
        usForward: 0,
        usReverse: 0,
        color: "#059369"
      },
      acci: {
        name: "AccI",
        site: "gtmkac",
        forwardRegex: "gt[acm][gkt]ac",
        reverseRegex: "gt[acm][gkt]ac",
        topSnipOffset: 2,
        bottomSnipOffset: 4,
        usForward: 0,
        usReverse: 0,
        color: "#0d994a"
      },
      // ...etc
    }
  },
  selectedAnnotations: {
    idMap: {},
    idStack: []
  },
  minimumOrfSize: 300,
  hoveredAnnotation: "",
  caretPosition: -1,
  selectionLayer: {
    start: -1,
    end: -1
  },
  readOnly: false,
  findTool: {
    isOpen: false,
    searchText: "",
    dnaOrAA: "DNA", //or "AA"
    ambiguousOrLiteral: "LITERAL", //or "AMBIGUOUS"
    highlightAll: false,
    matchNumber: 0
  },
  deletionLayers: {},
  replacementLayers: {},
  instantiated: true
};

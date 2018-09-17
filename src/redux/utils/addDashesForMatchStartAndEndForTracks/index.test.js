const addDashesForMatchStartAndEndForTracks = require("./index");
const jbeiSimple = require("./jbeiSimple.json");
const jbeiReverseStrand = require("./jbeiReverseStrand.json");
const jbeiSpansOrigin = require("./jbeiSpansOrigin.json");

describe("addDashesForMatchStartAndEndForTracks", function() {
  it("should run with no issues", function() {
    const tracksWithDashes = addDashesForMatchStartAndEndForTracks(
      jbeiSimple.pairwiseAlignments[0]
    );
    const [template, read] = tracksWithDashes;
    expect(template.alignmentData.sequence).toEqual(
      template.alignmentData.sequence_post
    );
    expect(template.sequenceData.sequence).toEqual(
      template.sequenceData.sequence_post
    );
    expect(read.alignmentData.sequence).toEqual(
      read.alignmentData.sequence_post
    );
    expect(read.sequenceData.sequence).toEqual(read.sequenceData.sequence_post);
  });
  it("should return the correct matches for an alignment on the reverse strand", function() {
    const tracksWithDashes = addDashesForMatchStartAndEndForTracks(
      jbeiReverseStrand.pairwiseAlignments[0]
    );
    const [template, read] = tracksWithDashes;
    expect(template.alignmentData.sequence).toEqual(
      template.alignmentData.sequence_post
    );
    expect(template.sequenceData.sequence).toEqual(
      template.sequenceData.sequence_post
    );
    expect(read.alignmentData.sequence).toEqual(
      read.alignmentData.sequence_post
    );
    expect(read.sequenceData.sequence).toEqual(read.sequenceData.sequence_post);
  });
  //commenting out until
  // it("should return the correct matches for an alignment that spans the origin", function() {
  //   const tracksWithDashes = addDashesForMatchStartAndEndForTracks(
  //     jbeiSpansOrigin.pairwiseAlignments[0]
  //   );
  //   const [template, read] = tracksWithDashes;
  //   expect(template.alignmentData.sequence).toEqual(
  //     template.alignmentData.sequence_post
  //   );
  //   expect(template.sequenceData.sequence).toEqual(
  //     template.sequenceData.sequence_post
  //   );
  //   expect(read.alignmentData.sequence).toEqual(
  //     read.alignmentData.sequence_post
  //   );
  //   expect(read.sequenceData.sequence).toEqual(read.sequenceData.sequence_post);
  // });
});

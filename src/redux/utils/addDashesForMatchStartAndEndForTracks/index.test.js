const addDashesForMatchStartAndEndForTracks = require("./index");
const jbeiSimple = require("./jbeiSimple.json");

describe("addDashesForMatchStartAndEndForTracks", function() {
  it("should run with no issues", function() {
    const tracksWithDashes = addDashesForMatchStartAndEndForTracks(
      jbeiSimple.pairwiseAlignments[0]
    );
    const [template, read] = tracksWithDashes;
    console.log("tracksWithDashes:", tracksWithDashes);
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
});

import calculateTickMarkPositionsForGivenRange from "../../../src/utils/calculateTickMarkPositionsForGivenRange";

describe("calculateTickMarkPositionsForGivenRange", () => {
  it("calculates tick marks correctly", () => {
    const res = calculateTickMarkPositionsForGivenRange({
      tickSpacing: 10,
      range: { start: 500, end: 60 },
      sequenceLength: 540
    });
    expect(res[0]).to.eql(500);
  });
});

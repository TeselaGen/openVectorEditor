describe("zoomLinearView.spec", function () {
  beforeEach(() => {
    cy.visit("#/Editor?focusLinearView=true");
  });
  it(`zooming to full zoom should have the underlying base pair sequence and amino acids show up.
  araD feature label should be showing in view upon full zoom
  scrolling to the right, labels like araD should be repositioning themselves to be in view`, function () {});
  it("zoom should be disabled for bps < 50 and bps > 20K", function () {});
  it("selecting dbl term feature and then zooming 6 times should make the label show up for that feature", function () {});
});

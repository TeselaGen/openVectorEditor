describe("zoomLinearView.spec", function () {
  it(`zooming to full zoom should have the underlying base pair sequence and amino acids show up.
  araD feature label should be showing in view upon full zoom
  scrolling to the right, labels like araD should be repositioning themselves to be in view`, function () {
    cy.visit("#/LinearView");
    cy.get(".ve-monospace-font").contains("gatgc").should("not.exist");
    cy.get(".S").should("not.exist");
    cy.get(".cutsiteLabelSelectionLayer").should("not.exist");

    cy.dragBetween(
      ".veZoomLinearSlider .bp3-slider-handle",
      ".veZoomLinearSlider .bp3-icon-plus"
    );
    cy.get(".ve-monospace-font").contains("gatgc").should("exist");
    cy.get(".S").should("exist");
    cy.get(".cutsiteLabelSelectionLayer").should("exist");
    cy.get(".veRowViewFeaturesContainer").contains("araD").should("exist");

    cy.get(".veRowItemWrapper").scrollTo(500, 0);
    cy.get(".veRowViewFeaturesContainer").contains("araD").should("exist");
  });
  it("zoom should be disabled for bps < 50 and bps > 30K", function () {
    cy.visit("#/Editor?focusLinearView=true&sequenceLength=45000");
    cy.get(`.veZoomLinearSlider`).should("not.exist");
    cy.contains("GFPuv").should("not.exist");
    cy.get(`[data-test="sequenceLength"]`).select("5299");
    cy.contains("GFPuv").should("exist");
    cy.get(`.veZoomLinearSlider`).should("exist");
    cy.get(`[data-test="sequenceLength"]`).select("10");
    cy.contains("GFPuv").should("not.exist");
    cy.get(`.veZoomLinearSlider`).should("not.exist");
  });
  // tnr: maybe enable this some day
  // it("scroll wheel should zoom in/out", function () {
  //   cy.visit("#/Editor?focusLinearView=true");
  //   cy.get('.veLinearView .veRowItem').trigger("wheel", { deltaY: 66.666666, wheelDelta: 240, wheelDeltaX: 120, wheelDeltaY: 120, bubbles: true})
  // });
  it("selecting 'dbl' term feature and then zooming 6 times should make the label show up for that feature", function () {
    cy.visit("#/Editor?focusLinearView=true");
    cy.get(".veRowViewFeature:contains(dbl term):first").click();
    pressZoom(7);
    cy.get(".veLinearView .veRowItemWrapper").scrollTo(500, 0);
    cy.get(".veRowViewFeature:contains(dbl term):first").should(
      "not.be.visible"
    );
    pressZoom(7);
    cy.get(".veRowViewFeature:contains(dbl term):first").should("be.visible");
    cy.get(".veRowViewFeature .veLabelText:contains(dbl term):first").should(
      "be.visible"
    );

    cy.get(".veLinearView .veRowItemWrapper").scrollTo(500, 0);
    cy.get(".veRowViewFeature:contains(dbl term):first").should(
      "not.be.visible"
    );

    cy.get(".veZoomLinearSlider .bp3-icon-minus").click();
    cy.get(".veRowViewFeature:contains(dbl term):first").should("be.visible");
  });
  it(`zoom level should be preserved even when the linear view is hidden and re-shown`, () => {});
});

function pressZoom(times) {
  for (let i = 0; i < times; i++) {
    cy.get(".veZoomLinearSlider .bp3-icon-plus").click();
  }
}

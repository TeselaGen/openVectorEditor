describe("zoomLinearView.spec", function () {
  it(`zooming to full zoom should have the underlying base pair sequence and amino acids show up.
  araD feature label should be showing in view upon full zoom
  scrolling to the right, labels like araD should be repositioning themselves to be in view`, function () {
    cy.visit("#/LinearView");
    cy.get(".ve-monospace-font").contains("gatgc").should("not.exist");
    cy.get(".S").should("not.exist");
    cy.get(".cutsiteLabelSelectionLayer").should("not.exist");

    cy.dragBetween(".bp3-slider-handle", ".bp3-icon-plus");
    cy.get(".ve-monospace-font").contains("gatgc").should("exist");
    cy.get(".S").should("exist");
    cy.get(".cutsiteLabelSelectionLayer").should("exist");
    cy.get(".veRowViewFeaturesContainer").contains("araD").should("exist");

    cy.get(".veRowItemWrapper").scrollTo(500, 0);
    cy.get(".veRowViewFeaturesContainer").contains("araD").should("exist");
  });
  it("zoom should be disabled for bps < 50 and bps > 20K", function () {
    cy.visit("#/Editor?sequenceLength=25000");
    cy.get(`.tg-zoom-bar`).should("not.exist");
    cy.visit("#/Editor?sequenceLength=10");
    cy.get(`.tg-zoom-bar`).should("not.exist");
  });
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

    cy.get(".tg-zoom-bar .bp3-icon-minus").click();
    cy.get(".veRowViewFeature:contains(dbl term):first").should("be.visible");
  });
});

function pressZoom(times) {
  for (let i = 0; i < times; i++) {
    cy.get(".tg-zoom-bar .bp3-icon-plus").click();
  }
}

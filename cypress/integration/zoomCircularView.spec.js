describe("zoomCircularView.spec", function () {
  it(`selecting a feature and zooming to full zoom should focus that feature 
  - and have the underlying base pair sequence show up
  - labels should be drawn internally that previously didn't fit!
  `, function () {
    cy.visit("");
    //a bunch of things should exist/not exist
    cy.get(".veCircularViewDnaSequence").should("not.exist");
    cy.get(`.veAnnotations-feature .veLabelText:contains(araD)`).should(
      "exist"
    );
    cy.get(`.veAnnotations-part .veLabelText:contains(Part 0)`).should(
      "not.exist"
    );
    cy.get(`.veLabels .veLabelText:contains(Part)`).should("exist");
    cy.get(
      `.veAnnotations-feature .veLabelText:contains(CmR I'm a real long label)`
    ).should("not.exist");
    cy.get(".ve-dna-letter-5300").should("not.exist");
    //click a feat and zoom fully in
    cy.get(
      `.veLabels .veLabelText:contains(CmR I'm a real long label)`
    ).click();
    cy.dragBetween(
      ".veZoomCircularSlider .bp3-slider-handle",
      ".veZoomCircularSlider .bp3-icon-plus"
    );
    cy.get(`.veLabels .veLabelText:contains(CmR I'm a real long label)`).should(
      "not.exist"
    );
    //a bunch of things should now exist/not exist
    cy.get(".ve-dna-letter-5300").should("not.exist");
    cy.get(".ve-dna-letter-4837:contains(a):contains(t)").should("exist");
    cy.get(".veCircularViewDnaSequence").should("exist");
    cy.get(
      `.veAnnotations-feature .veLabelText:contains(CmR I'm a real long label)`
    ).should("exist");
    cy.get(`.veAnnotations-feature .veLabelText:contains(araD)`).should(
      "not.exist"
    );
    //rotate to the end of the sequence
    cy.dragBetween(
      ".veRotateCircularSlider .bp3-slider-handle",
      ".veRotateCircularSlider .bp3-icon-arrow-right"
    );
    //new stuff should come in/out of view
    cy.get(".veCircularViewDnaSequence").should("exist");
    cy.get(".ve-dna-letter-5300:contains(a):contains(t)").should("exist");
    cy.triggerFileCmd("Reverse Sequence");
    cy.get(".ve-dna-letter-5300:contains(t)").should("not.exist");
    cy.get(".ve-dna-letter-5300:contains(a)").should("exist");
    cy.get(
      `.veAnnotations-feature .veLabelText:contains(CmR I'm a real long label)`
    ).should("not.exist");
    cy.get(`.veAnnotations-part .veLabelText:contains(Part 0)`).should("exist");
  });
  it(`rotating and then zooming should maintain your current rotation if nothing has been selected yet`, () => {
    cy.visit("");
    cy.dragBetween(
      ".veRotateCircularSlider .bp3-slider-handle",
      ".ve-tool-container-downloadTool"
    );
    cy.get(`.circularViewSvg g[style="transform: rotate(150deg);"]`);
    cy.dragBetween(
      ".veZoomCircularSlider .bp3-slider-handle",
      ".veZoomCircularSlider .bp3-icon-plus"
    );
    //after zoom in make sure we're not rotated back to the start of the sequence
    cy.get(`.veCircularViewFeature:contains(pSC101**)`).should("exist");
    cy.get(`.veAnnotations-part .veLabelText:contains(Part 0)`).should(
      "not.exist"
    );
  });

  it(`zoom level and rotation should be preserved even when the circular view is hidden and re-shown`, () => {
    //zoom all the way in
    cy.visit("");
    cy.dragBetween(
      ".veZoomCircularSlider .bp3-slider-handle",
      ".veZoomCircularSlider .bp3-icon-plus"
    );
    cy.get(".veCircularViewDnaSequence").should("exist");
    cy.get(".veTabLinearMap").click();
    cy.get(".veCircularViewDnaSequence").should("not.exist");
    cy.get(".veTabCircularMap").click();
    cy.get(".veCircularViewDnaSequence").should("exist");
  });

  it("zoom should be disabled for bps < 50", function () {
    cy.visit("#/Editor?sequenceLength=10");
    cy.get(`.veZoomCircularSlider`).should("not.exist");
    cy.contains("GFPuv").should("not.exist");
    cy.get(`[data-test="sequenceLength"]`).select("5299");
    cy.contains("GFPuv").should("exist");
    cy.get(`.veZoomCircularSlider`).should("exist");
  });
  // tnr: maybe enable this some day
  // it("scroll wheel should zoom in/out", function () {
  //   cy.visit("#/Editor?focusLinearView=true");
  //   cy.get('.veLinearView .veRowItem').trigger("wheel", { deltaY: 66.666666, wheelDelta: 240, wheelDeltaX: 120, wheelDeltaY: 120, bubbles: true})
  // });
  // it("selecting 'dbl' term feature and then zooming 6 times should make the label show up for that feature", function () {
  //   cy.visit("#/Editor?focusLinearView=true");
  //   cy.get(".veRowViewFeature:contains(dbl term):first").click();
  //   pressZoom(7);
  //   cy.get(".veLinearView .veRowItemWrapper").scrollTo(500, 0);
  //   cy.get(".veRowViewFeature:contains(dbl term):first").should(
  //     "not.be.visible"
  //   );
  //   pressZoom(7);
  //   cy.get(".veRowViewFeature:contains(dbl term):first").should("be.visible");
  //   cy.get(".veRowViewFeature .veLabelText:contains(dbl term):first").should(
  //     "be.visible"
  //   );

  //   cy.get(".veLinearView .veRowItemWrapper").scrollTo(500, 0);
  //   cy.get(".veRowViewFeature:contains(dbl term):first").should(
  //     "not.be.visible"
  //   );

  //   cy.get(".tg-zoom-bar .bp3-icon-minus").click();
  //   cy.get(".veRowViewFeature:contains(dbl term):first").should("be.visible");
  // });
});

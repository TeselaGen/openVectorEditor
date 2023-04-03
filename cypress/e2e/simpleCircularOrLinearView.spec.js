describe("simpleCircularOrLinearView", function () {
  // beforeEach(() => {
  //   cy.visit("/#/SimpleCircularOrLinearView");
  // });
  it(`should be able to view the SimpleCircularOrLinearViewNoRedux route and have oligos outside of a redux context if noRedux=true is passed`, () => {
    cy.visit("/#/SimpleCircularOrLinearView?isOligo=true");
    cy.get(".tg-simple-oligo-viewer");
    cy.contains(
      `GGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacaccccccGGGAAAagagagtgagagagtagagagagaccacacccccc`
    );
    cy.contains("164 bps");
    cy.contains("Test Seq");
  });
  it(`should be able to view the SimpleCircularOrLinearViewNoRedux route and have everything work outside of a redux context if noRedux=true is passed`, () => {
    cy.visit("/#/SimpleCircularOrLinearView?toggleNoRedux=true");
    cy.get(".veLinearView");
    cy.tgToggle("circular");
    cy.get(".veCircularView");
  });
  it(`withCaretEnabled should work`, () => {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(".veCaret").should("not.exist");
    cy.get(".veLabelText:contains(Part 2)").click();
    cy.get(".veCaret").should("not.exist");
    cy.tgToggle("withCaretEnabled");
    cy.get(".veLabelText:contains(Part 2)").click();
    cy.get(".veCaret").should("exist");
  });
  it(`withZoomLinearView should work`, () => {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(`.veZoomLinearSlider`).should("not.exist");
    cy.get(".ve-monospace-font").contains("gacgt").should("not.exist");
    cy.tgToggle("withZoomLinearView");
    cy.dragBetween(
      ".veZoomLinearSlider .bp3-slider-handle",
      ".veZoomLinearSlider .bp3-icon-plus"
    );
    cy.get(".ve-monospace-font").contains("gaga").should("exist");
  });
  it(`withZoomCircularView should work`, () => {
    cy.visit("/#/SimpleCircularOrLinearView?circular=true");
    cy.get(".veLabelText:contains(Part 1)").should("exist");
    cy.get(`.veRotateCircularSlider`).should("not.exist");
    cy.get(`.veZoomCircularSlider`).should("not.exist");
    cy.tgToggle("withZoomCircularView");
    cy.get(`.veRotateCircularSlider`).should("exist");
    cy.dragBetween(
      ".veZoomCircularSlider .bp3-slider-handle",
      ".veZoomCircularSlider .bp3-icon-plus"
    );
    cy.get(".veLabelText:contains(Part 1)").should("not.exist");
  });
  it(`withChoosePreviewType should work`, () => {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(".veLinearView");
    cy.get(".tgPreviewTypeCircular").should("not.exist");
    cy.tgToggle("withChoosePreviewType");
    cy.get(".tgPreviewTypeCircular").click();
    cy.get(".veCircularView");
    cy.get(".tgPreviewTypeRow").click();
    cy.get(".veRowView");
  });
  it(`withDownload should work`, () => {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(".veDownloadButton").should("not.exist");
    cy.tgToggle("withDownload");
    cy.get(".veDownloadButton").click();
    cy.contains("Download Genbank File").click();
    cy.contains("File Downloaded Successfully");
  });
  it(`parts that overlap self should draw on the same level`, function () {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(
      `[data-y-offset="1"].veRowViewAnnotationPosition:contains(Part 2)`
    ).should("have.length", 3);
    cy.tgToggle("withAdditionalParts");
    cy.get(
      `[data-y-offset="1"].veRowViewAnnotationPosition:contains(Part 2)`
    ).should("have.length", 3);

    // tnrtodo: fix the circular view drawing to force parts that wrap around self to draw on the same level
    // cy.tgToggle('circular')
  });
  it(`can click and right click a part and have the handlers passed on the part be hit!`, function () {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(`.veRowViewPartsContainer path`)
      .first()
      .click({ force: true })
      .trigger("contextmenu", { force: true });
    cy.contains("Part Clicked!");
    cy.contains("Part Right Clicked!");
  });
  it(`can toggle not passing in sequence data without any issue`, function () {
    cy.visit("/#/SimpleCircularOrLinearView");
    //this just tests that this toggle doesn't throw an error
    cy.tgToggle("noSequence");
    cy.get(`.veLinearView`);
    //this just tests that this toggle doesn't throw an error
    cy.tgToggle("limitLengthTo50Bps");
    cy.get(`.veLinearView`);
    //this just tests that this toggle doesn't throw an error
    cy.tgToggle("circular");
    cy.get(`.veCircularView`);
  });
  it(`can toggle part colors`, function () {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(`path[stroke="red"]`).should("not.exist");
    cy.tgToggle("togglePartColor");
    cy.get(`path[stroke="red"]`).should("exist");
  });
  it(`can toggle a part hover`, function () {
    cy.visit("/#/SimpleCircularOrLinearView?circular=true");
    cy.get(".veCircularViewLabelText.veAnnotationHovered").should("not.exist");
    cy.tgToggle("hoverPart");
    cy.get(".veCircularViewLabelText.veAnnotationHovered").should("exist");
  });
  it(`can toggle changing size`, function () {
    cy.visit("/#/SimpleCircularOrLinearView");
    cy.get(`.veLinearView`).invoke("outerHeight").should("equal", 300);
    cy.get(`.veLinearView`).invoke("outerWidth").should("equal", 300);
    cy.tgToggle("changeSize");
    cy.get(`.veLinearView`).invoke("outerHeight").should("equal", 500);
    cy.get(`.veLinearView`).invoke("outerWidth").should("equal", 500);
  });
});

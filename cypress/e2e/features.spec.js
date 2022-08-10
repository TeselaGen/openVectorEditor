describe("features", () => {
  it(`when allowMultipleFeatureDirections=false, editing the feature strand should show up correctly in the preview`, () => {
    cy.visit("");
    cy.contains(".veLabelText", "araD").dblclick({ force: true });
    cy.get(`.ann-reverse:contains(araD)`);
    cy.get(`.ann-forward:contains(araD)`).should("not.exist");
    cy.contains("Positive").click();
    cy.get(`.ann-reverse:contains(araD)`).should("not.exist");
    cy.get(`.ann-forward:contains(araD)`);
  });
  it(`when allowMultipleFeatureDirections=true, features should be able to have a strand of NONE - keywords: arrowheadType directionality`, () => {
    cy.visit(
      "#Editor?allowMultipleFeatureDirections=true&focusProperties=true&propertyTab=genbank"
    );
    cy.contains(`/direction="NONE"`).should("not.exist");
    cy.contains(".veLabelText", "araD").dblclick({ force: true });
    cy.get(`.tg-arrowheadType-BOTTOM.bp3-active`);
    cy.get(`.tg-arrowheadType-NONE`).click();
    cy.get(`button:contains(Save)`).click();
    cy.get(".bp3-tab:contains(Genbank)").click({ force: true });
    cy.contains(`/direction="NONE"`).should("exist");
    cy.contains(".veLabelText", "araD").dblclick({ force: true });
    cy.get(`.tg-arrowheadType-NONE.bp3-active`);
  });
  it(`when allowMultipleFeatureDirections=true, features should be able to have a strand of NONE - keywords: arrowheadType directionality`, () => {
    cy.visit("#Editor?allowMultipleFeatureDirections=true");
    cy.selectRange(10, 20);

    cy.triggerFileCmd("New Feature");
    cy.get(`.tg-arrowheadType-TOP.bp3-active`);
    cy.get(`.tg-arrowheadType-BOTTOM.bp3-active`).should("not.exist");
    cy.get(`.ann-forward:contains(Untitled)`);
    cy.get(`.ann-reverse:contains(Untitled)`).should("not.exist");
    cy.get(`.tg-arrowheadType-BOTTOM`).click();
    cy.get(`.ann-forward:contains(Untitled)`).should("not.exist");
    cy.get(`.ann-reverse:contains(Untitled)`);
  });
});

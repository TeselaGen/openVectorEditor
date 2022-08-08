describe("features", () => {
  it(`features should be able to have a strand of NONE - keywords: arrowheadType directionality`, () => {
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
});

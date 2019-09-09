describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`should be able to visualize warnings on the circular and row views and click them`, () => {
    cy.tgToggle("showWarningFeature");
    cy.get(".veAnnotations-warning")
      .contains("J5 Error")
      .first()
      .click({ force: true });
    cy.contains(".bp3-dialog", "I'm a fake error!");
  });
});

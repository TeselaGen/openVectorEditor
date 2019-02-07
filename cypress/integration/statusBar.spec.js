describe("statusBar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can change to linear mode via the status bar and get a warning that annotations will be truncated", function() {
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains("Truncate Annotations").should("exist");
    cy.contains("Truncate Annotations").should("be.visible");
  });
  it(`if viewing a linear sequence in the circular view, there should be a little warning 
  on the circular view telling the user that the sequence is linear`, () => {
    cy.contains(`[data-test="ve-warning-circular-to-linear"]`).should(
      "not.exist"
    );
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains("Truncate Annotations").click();
    cy.get(`[data-test="ve-warning-circular-to-linear"]`);
  });
});

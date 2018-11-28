describe("menuBar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can change to linear mode via the status bar and get a warning that annotations will be truncated", function() {
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains("Truncate Annotations").should("exist")
    cy.contains("Truncate Annotations").should("be.visible")
    
  });
});

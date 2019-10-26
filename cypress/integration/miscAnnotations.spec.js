describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can display lineageAnnotations and assemblyPieces and click them", function() {
    cy.tgToggle("showLineageAnnotations");
    cy.contains("Lineage Annotation 1");
    cy.contains(".veLabelText", "Lineage Annotation 2").click();
    cy.contains("Selecting 499 bps from 402 to 900");
    cy.tgToggle("showAssemblyPieces");
    cy.contains("Assembly Piece 1");
    cy.contains(".veLabelText", "Assembly Piece 2").click();
    cy.contains("Selecting 499 bps from 402 to 900");
  });
});

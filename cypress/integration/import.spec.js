describe("import", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it("import tool should be able to import a genbank file", function () {
    cy.uploadFile(`[data-test="veImportTool"]`, "pj5_00002.gb");
    cy.contains("Sequence Imported").should("exist");
  });
  it("import tool should be able to import a snapgene .dna file", function () {
    cy.uploadFile(`[data-test="veImportTool"]`, "addgene-plasmid.dna");
    cy.contains("Sequence Imported").should("exist");
    cy.contains("pAdTrack-CMV");
    cy.contains("CMV promoter").should("exist");
  });
});

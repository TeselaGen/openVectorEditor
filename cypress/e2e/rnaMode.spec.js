describe("rna editing in OVE", function () {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should support rna editing`, () => {
    cy.get(`[data-test="moleculeType"]`).select("RNA");
    cy.contains("uuaugacaacuugacggcuacaucauucacuuuuucuuca");
    cy.selectRange(10, 11);
    cy.get(".veSelectionLayer").first().rightclick({ force: true });
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("tguugttuuuuuuuuuuuuuuuaa{enter}");
    cy.contains("Selecting 24 bps from 10 to 33"); //the t's should be converted to u's
    cy.contains("uguuguuuuuuuuuuuuuuuuuaa");
  });
  it(`should support mixed rna and dna editing`, () => {
    cy.get(`[data-test="moleculeType"]`).select("mixedRnaAndDna");
    cy.contains("uuaugacaacuugacggcuacaucauucacuuuuucuuca").should("not.exist");
    cy.contains("uuuugacgt");
    cy.selectRange(10, 11);
    cy.get(".veRowViewSelectionLayer.notCaret").first().rightclick();
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("tguugttuuuuuuuuuuuuuuuaa{enter}");
    cy.contains("Selecting 24 bps from 10 to 33"); //the t's should not be filtered out and neither should the u's
    cy.contains("tguugttuuuuuuuuuuuuuuuaa");
  });
});

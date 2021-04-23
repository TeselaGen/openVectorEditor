describe("rna editing in OVE", function () {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should support rna editing`, () => {
    cy.tgToggle(`isRna`);
    cy.contains("uuaugacaacuugacggcuacaucauucacuuuuucuuca");
    cy.selectRange(10, 11);
    cy.get(".veSelectionLayer").first().rightclick();
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("tguugttuuuuuuuuuuuuuuuaa{enter}");
    cy.contains("Selecting 21 bps from 10 to 30"); //the t's should be filtered out
    cy.contains("guuguuuuuuuuuuuuuuuaa");
  });
  it(`should support mixed rna and dna editing`, () => {
    cy.tgToggle(`isMixedRnaAndDna`);
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

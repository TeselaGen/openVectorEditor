describe("oligo mode editing in OVE", function () {
  it(`should support oligo editing`, () => {
    cy.visit("");
    cy.get(`[data-test="veStatusBar-circularity"]`);
    cy.get(`[data-test="moleculeType"]`).select("Oligo");
    cy.get(`[data-test="veStatusBar-circularity"]`).should("not.exist");

    cy.contains("cccccttttttttcacacactactatattagtgagagagacccaca");
    cy.contains("tgtgggtctctctcactaatatagtagtgtgtgaaaaaaaaggggg").should(
      "not.exist"
    );
    cy.selectRange(10, 11);
    cy.get(".veSelectionLayer").first().rightclick({ force: true });
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("gatccaauu{enter}");
    cy.contains("Selecting 9 bps from 10 to 18"); //the t's should be filtered out
    cy.contains("gatccaauu");
    cy.get(".veTabProperties").click();
    cy.contains("Circular/Linear:").should("not.exist");
    cy.contains(".bp3-tab", "Primers").should("not.exist");
  });
  it(`primer tool should not exist for oligo mode but then come back when switching back to DNA mode`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-oligoTool").should("exist");
    cy.get(`[data-test="moleculeType"]`).select("Oligo");
    cy.get(".ve-tool-container-oligoTool").should("not.exist");
    cy.get(`[data-test="moleculeType"]`).select("DNA");
    cy.get(".ve-tool-container-oligoTool").should("exist");
  });
});

describe("addAdditionalEnzymes", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`cutsite cut numbers should update as cutsites are added`, () => {
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "AatII").click();
    cy.get(".tg-select .bp3-icon-caret-up").click();
    cy.contains("(2 cuts)").should("not.exist");
    cy.contains("(1 cut)");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.selectRange(10, 20);
    cy.get(".veSelectionLayer").first().rightclick({ force: true });
    // cy.contains(".veLabelText", "araD").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("gacgtc{enter}");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();

    cy.contains("(2 cuts)");
  });
});

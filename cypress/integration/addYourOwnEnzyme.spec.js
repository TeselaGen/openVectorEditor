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

  it(`can open the add additional enzymes dialog from the Tools > Manage Enzymes 
  and add a custom user enzyme `, function () {
    cy.get(".tg-menu-bar").contains("Tools").click();
    cy.get(".bp3-menu-item").contains("Create Custom Enzyme").click();
    cy.contains("Cuts 0 times in pj5_00001");
    cy.get(`input[value="Example Enzyme"]`).type("{selectall}ExEnz");
    cy.get(`input[value="ggatcc"]`).type("{selectall}gac");
    cy.contains("Enzyme recognition sequence must be at least 4bps long");
    cy.get(`input[value="gac"]`).type("gtc");
    cy.contains("Cuts 1 time in pj5_00001");
    cy.contains("Submit").click();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.triggerFileCmd("Manage Enzymes");
    cy.contains(".bp3-dialog div", "ExEnz").trigger("mouseover");
    cy.contains(".hoveredEnzymeContainer", "ExEnz");
  });
});

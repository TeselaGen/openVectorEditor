describe("enzymeManager", () => {
  it(`enzymes not shown by default should show up when added to a group (and hiding an enzyme that is shown in a group should work)`, () => {
    cy.visit("");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");
    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("newGroup");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.contains(".bp3-dialog div", "Hidden").click();
    cy.contains("Bpa36II").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();

    cy.contains("Copy 1 Enzyme(s)");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();
    cy.contains(".veEnzymeDialogEnzyme", "Bpa36II").should("not.exist");
    cy.contains("Deselect 0").should("exist");
    cy.contains("My Enzymes").click();
    cy.contains(".veEnzymeDialogEnzyme", "Bpa36II").should("exist");
    cy.closeToasts();
    cy.closeDialog();

    cy.contains(".veLabelText", "Bpa36II").should("not.exist");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();

    cy.contains(".bp3-menu-item", "newGroup").click();
    cy.contains(".veLabelText", "Bpa36II").should("exist");
    cy.get(".bp3-menu-item:contains(Bpa36II) .bp3-icon-eye-off").click();
    cy.contains(".veLabelText", "Bpa36II").should("not.exist");
  });
  it(`should be able to add a new group and add enzymes to it`, () => {
    cy.visit("");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");
    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("newGroup");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.contains("My Enzymes").click();
    cy.contains("AccIII").click();
    cy.contains("Eco52I").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    // cy.get('.veEnzymeGroupAddEnzymesBtn').blur()
    cy.contains("Copy 2 Enzyme(s)");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();
    cy.contains("Deselect 0").should("exist");

    cy.contains(".bp3-dialog .bp3-menu-item", "newGroup").click();
    cy.contains("AccIII").click();
    cy.get(".veRemoveEnzymeFromGroupBtn").click();
    cy.contains("button", "OK").click();
    cy.closeToasts();
    cy.closeDialog();
    cy.contains("AccIII").should("not.exist");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".bp3-menu-item", "newGroup").click();

    // cy.get('.veEnzymeGroupAddEnzymesBtn').click()
  });
});

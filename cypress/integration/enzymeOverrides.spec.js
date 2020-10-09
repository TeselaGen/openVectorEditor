describe("enzyme overrides", () => {
  it(`should be able to override the manage enzyme functionality`, () => {
    cy.visit("");
    cy.tgToggle("overrideManageEnzymes");
    cy.triggerFileCmd("Manage Enzymes");
    cy.contains("enzyme manage override ");
    cy.closeToasts();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.contains("Manage Enzymes...").click();
    cy.contains("enzyme manage override ");
  });
  it(`should be able to override the enzyme manage and group functionality`, () => {
    cy.visit("");
    cy.tgToggle("overrideManageEnzymes");
    cy.triggerFileCmd("Filter Cutsites");
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.get(".bp3-icon-small-cross").click(); //clear single cutters
    cy.contains("someGroup").click();
    cy.contains(".veLabelText", "AcsI").should("not.exist");
    cy.contains(".veLabelText", "EcoPI").should("not.exist");
    cy.contains(".veLabelText", "BsmBI").should("not.exist");
    cy.contains(".veLabelText", "specialEnzyme1").should("exist");
    cy.contains(".veLabelText", "specialEnzyme2").should("not.exist");
    cy.contains("anothaGroup").click();
    cy.contains(".veLabelText", "specialEnzyme2").should("exist");
    cy.contains(".veLabelText", "BsmBI").should("exist");
  });
  it(`should be able to make enzyme groups with additionalEnzymes`, () => {
    cy.visit("");
    cy.tgToggle("additionalEnzymes");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");

    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("newGroup");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.contains("My Enzymes").click();
    cy.contains("specialEnzyme1").click();
    cy.contains("specialEnzyme2").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();

    cy.contains("Copy 2 Enzyme(s)");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();

    cy.closeToasts();
    cy.closeDialog();

    cy.contains(".veLabelText", "Bpa36II").should("not.exist");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();

    cy.contains(
      ".veToolbarCutsiteFilterHolder .bp3-menu-item",
      "newGroup"
    ).click();
    cy.contains(".veLabelText", "specialEnzyme1").should("exist");
    cy.contains(".veLabelText", "specialEnzyme2").should("exist");
  });
});

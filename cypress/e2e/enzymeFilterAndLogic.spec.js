describe("enzymeFilterAndLogic.spec", () => {
  it(`AND/OR should not appear when just one group is selcted`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    //should have no defaults set initially
    cy.contains("AND/OR").should("not.exist");
  });

  it(`AND/OR should not appear when just 0 groups are selcted`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(".tg-select-value .bp3-tag-remove").click();
    cy.contains("AND/OR").should("not.exist");
  });

  it(`AND/OR should not appear when groups without an enzymes in common are selected`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(".tg-select-value .bp3-tag-remove").click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".bp3-menu-item", "AatII").click();
    cy.contains(".bp3-menu-item", "AccII").click();
    cy.contains("AND/OR").should("not.exist");
  });

  it(`AND/OR should not appear when custom groups without enzymes in common are selected`, () => {
    cy.visit("");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");
    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group1");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AluI").click();
    cy.contains("AccII").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();

    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group2");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AfaI").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".bp3-popover  .bp3-html-select select").select("group2");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();
    cy.closeToasts();
    cy.closeDialog();

    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();

    cy.get(".tg-select-value .bp3-tag-remove").click();
    cy.contains(".bp3-menu-item", "group1").click();
    cy.contains(".bp3-menu-item", "group2").click();

    cy.contains("AND/OR").should("not.exist");
  });

  it(`AND/OR should appear when custom groups that have enzymes in common are selected`, () => {
    cy.visit("");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");
    cy.get(".bp3-button-group .veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group1");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AluI").click();
    cy.contains("AfaI").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();

    cy.get(".bp3-button-group .veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group2");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AfaI").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".bp3-popover  .bp3-html-select select").select("group2");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();
    cy.closeToasts();
    cy.closeDialog();

    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();

    cy.get(".tg-select-value .bp3-tag-remove").click();
    cy.contains(".bp3-menu-item", "group1").click();
    cy.contains(".bp3-menu-item", "group2").click();

    cy.contains("AND/OR");
  });

  it(`When AND logic is selected only shared enzymes should appear`, () => {
    cy.visit("");
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.triggerFileCmd("Manage Enzymes");
    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group1");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AluI").click();
    cy.contains("AfaI").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();

    cy.get(".veEnzymeDialogAddGroupBtn").click();
    cy.get(".veNewEnzymeGroupPopover input").type("group2");
    cy.get(".veNewEnzymeGroupPopover .bp3-icon-tick").click();
    cy.get("body").click(0, 0); //click away so tool tip resets
    cy.contains("My Enzymes").click();
    cy.contains("AfaI").click();
    cy.get(".veEnzymeGroupAddEnzymesBtn").click();
    cy.get(".bp3-popover  .bp3-html-select select").select("group2");
    cy.get(".veEnzymeGroupMoveEnzymePopover .bp3-icon-tick").click();
    cy.closeToasts();
    cy.closeDialog();

    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();

    cy.get(".tg-select-value .bp3-tag-remove").click();
    cy.contains(".bp3-menu-item", "group1").click();
    cy.contains(".bp3-menu-item", "group2").click();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.contains("AluI");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.contains("AND/OR").click();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.contains("AluI").should("not.exist");
  });
});

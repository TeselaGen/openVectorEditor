describe("addAdditionalEnzymes", function() {
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

    cy.contains(".veLabelText", "araD").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("gacgtc{enter}");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();

    cy.contains("(2 cuts)");
  });

  it(`can open the add additional enzymes dialog from the Tools > Add Additional Enzymes 
  and add a custom user enzyme `, function() {
    cy.get(".tg-menu-bar")
      .contains("Tools")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Add Additional Enzymes")
      .click();
    cy.contains("Create your own enzyme").click();
    cy.contains("Cuts 0 times in your Destination Vector");
    cy.get(`input[value="Example Enzyme"]`).type("{selectall}ExEnz");
    cy.get(`input[value="ggatcc"]`).type("{selectall}gac");
    cy.contains("Enzyme recognition sequence must be at least 4bps long");
    cy.get(`input[value="gac"]`).type("gtc");
    cy.contains("Cuts 1 time in your Destination Vector");
    cy.contains("Use Enzyme").click();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
  });
  it(`can open the add additional enzymers dialog from the Tools > Add Additional Enzymes 
  and add an additional enzyme `, function() {
    cy.get(".tg-menu-bar")
      .contains("Tools")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Add Additional Enzymes")
      .click();
    cy.get(`input[placeholder="Select cut sites..."]`).click();
    cy.contains("AaaI").click();
    cy.contains("AaaI (Cuts 0 times)").should("be.visible");
    cy.contains("button", "Add Enzyme").click();
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.contains("(0 cuts)").should("be.visible");
  });
  it("can open the create a new enzyme dialog from the cutsite filter dropdown", function() {
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".bp3-menu-item", `Add additional enzyme`).click();
    cy.contains(".bp3-heading", "Add Additional Enzymes");

    // cy.get(`[data-test="veStatusBar-circularity"]`)
    //   .find("select")
    //   .select("Linear");
    // cy.contains("Truncate Annotations").should("be.visible");
  });
});

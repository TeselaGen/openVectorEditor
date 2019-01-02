describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should autosave if autosave=true`, function() {
    cy.contains("shouldAutosave")
      .find("input")
      .check({ force: true });
    cy.get(".veRowViewPart")
      .contains("Part 0")
      .first()
      .click({ force: true });
    cy.get(".veRowViewSelectionLayer")
      .first()
      .trigger("contextmenu", { force: true });
    cy.get(".bp3-menu-item")
      .contains("Cut")
      .click();
    cy.contains("onCopy callback triggered");
    cy.contains("onSave callback triggered");
    cy.contains("Selection Cut");
  });
  it(`should handle rightClickOverrides correctly if they are passed`, function() {
    cy.contains("Show custom right click")
      .find("input")
      .check({ force: true });
    cy.get(".veLabelText")
      .contains("Part 0")
      .trigger("contextmenu", { force: true });
    cy.get(".bp3-menu")
      .contains("My Part Override")
      .click();
    cy.contains("Part Override hit!").should("be.visible");
  });
  it(`should handle propertiesListOverrides correctly if they are passed`, function() {
    cy.contains("Show custom properties overrides")
      .find("input")
      .check({ force: true });
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="parts"]`).click();
    cy.get(".ve-propertiesPanel")
      .contains("parts footer button")
      .click();

    cy.get(".bp3-toast")
      .contains("properties overrides successfull")
      .should("be.visible");
  });
  it(`should handle custom menu filters correctly`, ()=> {
      cy.contains("Show custom menu overrides example").find("input")
      .check({ force: true });
    cy.get(".tg-menu-bar").contains("Custom").click()
    cy.get(".bp3-menu-item").contains("Copy").click()
    cy.get(".bp3-toast").contains("No Sequence Selected To Copy")
    cy.get(".tg-menu-bar").contains("File").click()
    cy.get(".bp3-menu-item").contains("Export Sequence").click()
    cy.contains("Custom export option!").click()
    cy.get(".bp3-toast").contains("Custom export hit!")
  })
});

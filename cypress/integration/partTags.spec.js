describe("partTypes", function () {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should be able to see and search for part tags in the properties window`, () => {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="parts"]`).click();
    cy.contains(".rt-tr .bp3-tag", "status: ready").should("exist");
    cy.get(".datatable-search-input").type("zoink{enter}");
    cy.contains(".rt-tr .bp3-tag", "status: ready").should("not.exist");
    cy.contains(".rt-tr .bp3-tag", "zoink").should("exist");
  });

  it(`should be able to add/edit tags on parts`, () => {
    cy.get(".veRowViewSelectionLayer").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Part").click();
    cy.focused().type("np");
    cy.get(".tg-test-tags").click();
    cy.contains(".bp3-menu-item", "status: ready").click();
    cy.contains(".bp3-tag-input-values", "status: ready").should("exist");
    cy.contains(".bp3-menu-item", "status: broken").click();
    cy.contains(".bp3-tag-input-values", "status: ready").should("not.exist");
    cy.contains(".bp3-menu-item", "tag2").click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veRowViewPart", "np").rightclick();
    cy.contains(".bp3-menu-item", "Edit Part").click();
    cy.contains(".bp3-tag-input-values", "status: broken").should("exist");
    cy.get(".example-editTagsLink").click();
    cy.contains("You hit the editTagsLink!");
  });
});

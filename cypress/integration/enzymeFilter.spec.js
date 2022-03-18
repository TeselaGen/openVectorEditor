describe("enzymeFilter.spec", () => {
  it(`we should be able to persist a default filter`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(`.tg-persist-cutsite-filter`);
    cy.get(`.tg-persist-cutsite-filter .bp3-icon-cross`).should("not.exist");
    cy.contains(`.tg-persist-cutsite-filter`, "Persist Filter").click();
    cy.contains("Successfully set a new default filter");
    cy.closeToasts();
    cy.get(`.tg-persist-cutsite-filter .bp3-icon-cross`).click();
    cy.get(`.tg-persist-cutsite-filter .bp3-icon-cross`).should("not.exist");
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "Van").click();
    cy.contains(`.tg-persist-cutsite-filter`, "Persist Filter").click();
    cy.contains("Successfully set a new default filter");
    //the cutsite filter should persist
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    cy.reload();
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(`.tg-persist-cutsite-filter .bp3-icon-cross`);
  });
});

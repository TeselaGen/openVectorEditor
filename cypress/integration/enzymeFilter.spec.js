describe("enzymeFilter.spec", () => {
  it(`we should be able to have individual cutsites filters be specific to individual sequences and set a global default filter`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.window().then((win) => {
      //should have no defaults set initially

      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(thisSeqFilter === null);
    });
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "AatII").click();
    cy.window().then((win) => {
      //upon change we should have just the local-to-this-seq filter set
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(thisSeqFilter !== null);
    });

    cy.contains(".tg-select-option", "AauI").click();
    cy.reload();
    //after reload we should get the enzymes that we had last chosen by default (not the global default that we set)
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.contains(".tg-select-value", "Single cutters");
    cy.contains(".tg-select-value", "AatII");
    cy.contains(".tg-select-value", "AauI");
  });
});

describe("enzymeFilter.spec", () => {
  it(`we should be able to have individual cutsites filters be specific to individual sequences and set a global default filter`, () => {
    cy.visit("");
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.window().then((win) => {
      //should have no defaults set initially
      const allSeqFilter = win.localStorage.getItem("tgInitialCutsiteFilter");
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(allSeqFilter === null);
      assert(thisSeqFilter === null);
    });
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "AatII").click();
    cy.window().then((win) => {
      //upon change we should have just the local-to-this-seq filter set
      const allSeqFilter = win.localStorage.getItem("tgInitialCutsiteFilter");
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(allSeqFilter === null);
      assert(thisSeqFilter !== null);
    });

    cy.contains(`.tg-persist-cutsite-filter`, "Set as Default").click();
    cy.contains(`Use the current filter as the default filter for:`);

    cy.get(
      `.tg-all-seqs-filter-ctrls .bp3-button.bp3-disabled.bp3-intent-danger`
    ).should("exist");

    cy.contains("All Sequences").click();
    cy.get(
      `.tg-all-seqs-filter-ctrls .bp3-button.bp3-disabled.bp3-intent-danger`
    ).should("not.exist");
    cy.contains("Successfully set a new global default filter");
    cy.window().then((win) => {
      //now we should have
      const allSeqFilter = win.localStorage.getItem("tgInitialCutsiteFilter");
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(allSeqFilter !== null);
      assert(thisSeqFilter !== null);
    });

    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "AauI").click();
    cy.reload();
    //after reload we should get the enzymes that we had last chosen by default (not the global default that we set)
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.contains(".tg-select-value", "Single cutters");
    cy.contains(".tg-select-value", "AatII");
    cy.contains(".tg-select-value", "AauI");
    //we should still have an all Seq filter
    cy.window().then((win) => {
      const allSeqFilter = win.localStorage.getItem("tgInitialCutsiteFilter");
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(allSeqFilter !== null);
      assert(thisSeqFilter !== null);
    });
    cy.contains(`.tg-persist-cutsite-filter`, "Set as Default").click();

    cy.contains(".bp3-button.bp3-disabled", "All Sequences").should(
      "not.exist"
    );
    cy.contains(".bp3-button", "All Sequences").click();
    cy.contains(".bp3-button.bp3-disabled", "All Sequences").should("exist");

    cy.get(".bp3-button.bp3-intent-danger .bp3-icon-trash").click();
    cy.contains(".bp3-button.bp3-disabled", "All Sequences").should(
      "not.exist"
    );
    cy.window().then((win) => {
      const allSeqFilter = win.localStorage.getItem("tgInitialCutsiteFilter");
      const thisSeqFilter = win.localStorage.getItem(
        "tgInitialCutsiteFilter-jdosjio81"
      );
      assert(allSeqFilter === null);
      assert(thisSeqFilter !== null);
    });
  });
});

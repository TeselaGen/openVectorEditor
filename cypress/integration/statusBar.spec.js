describe("statusBar", function () {
  it("molcule type should be an option in the menu bar", function () {
    cy.visit("");
    cy.contains(`[data-test="veStatusBar-type"]`, "DNA");
    cy.get(`[data-test="moleculeType"]`).select("Protein");
    cy.contains(`[data-test="veStatusBar-type"]`, "Protein");
    cy.get(`[data-test="moleculeType"]`).select("RNA");
    cy.contains(`[data-test="veStatusBar-type"]`, "RNA");
    cy.get(`[data-test="moleculeType"]`).select("Oligo");
    cy.contains(`[data-test="veStatusBar-type"]`, "Oligo");
    cy.get(`[data-test="moleculeType"]`).select("mixedRnaAndDna");
    cy.contains(`[data-test="veStatusBar-type"]`, "Mixed RNA/DNA");

    cy.tgToggle("showMoleculeType", false);
    cy.get(`[data-test="veStatusBar-type"]`).should("not.exist");
  });
  it("melting temp should be an option in the menu bar", function () {
    cy.visit("");
    cy.selectRange(10, 30);
    cy.contains("Melting Temp").should("not.exist");
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".bp3-menu-item").contains("Melting Temp").click();
    cy.contains("Melting Temp: 62.69").click();
    cy.get(`[value="default"][checked]`);
  });
  it(`if viewing a linear sequence in the circular view, there should be a little warning 
  on the circular view telling the user that the sequence is linear`, () => {
    cy.visit("");
    cy.contains(`[data-test="ve-warning-circular-to-linear"]`).should(
      "not.exist"
    );
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear", { force: true });
    cy.contains("Truncate Annotations").click();
    cy.get(`[data-test="ve-warning-circular-to-linear"]`);
  });
  it(`allow setting a default for showing GC content`, function () {
    cy.visit("");
    cy.selectRange(1, 100);
    cy.tgToggle("showGCContentByDefault");
    cy.get(`[data-test="veStatusBar-selection"]`)
      .contains("Selecting 100 bps from 1 to 100 (")
      .contains("(51.0% GC)");
  });
  it(`showing gc content should also be a user toggleable option persisted to localstorage`, function () {
    cy.visit("");
    cy.selectRange(1, 100);

    cy.get(`[data-test="veStatusBar-selection"]`).contains(
      "Selecting 100 bps from 1 to 100"
    );

    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".bp3-menu-item").contains("GC Content").click();

    cy.get(`[data-test="veStatusBar-selection"]`)
      .contains("Selecting 100 bps from 1 to 100 (")
      .contains("(51.0% GC)");
  });
});

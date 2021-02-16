describe("statusBar", function () {
  it("melting temp should be an option in the menu bar", function () {
    cy.visit("");
    cy.selectRange(10, 30);
    cy.contains("Melting Temp").should("not.exist");
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".bp3-menu-item").contains("Melting Temp").click();
    cy.contains("Melting Temp: 62.69").click();
    cy.get(`[value="default"][checked]`);
  });
  it("can change to linear mode via the status bar and get a warning that annotations will be truncated", function () {
    cy.visit("");
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains("Truncate Annotations").should("be.visible");
  });
  it(`if viewing a linear sequence in the circular view, there should be a little warning 
  cy.visit("");
  on the circular view telling the user that the sequence is linear`, () => {
    cy.contains(`[data-test="ve-warning-circular-to-linear"]`).should(
      "not.exist"
    );
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
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

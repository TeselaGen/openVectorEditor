describe("statusBar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can change to linear mode via the status bar and get a warning that annotations will be truncated", function() {
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains("Truncate Annotations").should("be.visible");
  });
  it(`if viewing a linear sequence in the circular view, there should be a little warning 
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
  it(`should display optional gc content`, function() {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Select...")
      .click();
    cy.focused().type("{selectall}1");
    cy.get("div.tg-test-to .bp3-input")
      .type("{selectall}100")
      .get(".bp3-intent-primary")
      .contains("Select 100 BPs")
      .click();
    cy.get(`[data-test="veStatusBar-selection"]`).contains(
      "Selecting 100 bps from 1 to 100"
    );
    cy.get(`[data-test="showGCContent"]`).click({ force: true });
    cy.get(`[data-test="veStatusBar-selection"]`)
      .contains("Selecting 100 bps from 1 to 100 (")
      .contains("(51.0% GC)");
  });
});

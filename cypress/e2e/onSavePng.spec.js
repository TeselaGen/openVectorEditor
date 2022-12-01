describe("onSavePng", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`generate a png onSave if pngGenerate option is set to true`, () => {
    cy.window().then((win) => {
      cy.spy(win.console, "log");
    });
    cy.tgToggle("alwaysAllowSave");
    cy.tgToggle("generatePng");
    cy.get(`[data-test="saveTool"]`).click();
    cy.contains(".bp3-dialog", "Generating Image to Save");
    cy.get(".bp3-dialog .veCircularView");
    cy.contains("onSave callback triggered", { timeout: 40000 }).then(() => {
      // eslint-disable-next-line no-unused-expressions
      expect(window.Cypress.pngFile).to.exist;
      expect(window.Cypress.pngFile.type).to.eq("image/png");
    });
    //change the circularity and make sure it saves the linear view instead of circular
    cy.get(`[data-test="veStatusBar-circularity"]`)
      .find("select")
      .select("Linear");
    cy.contains(".bp3-dialog button", "Truncate Annotations").click();

    cy.get(`[data-test="saveTool"]`).click();
    cy.contains(".bp3-dialog", "Generating Image to Save");
    cy.get(".bp3-dialog .veLinearView");
    cy.contains("onSave callback triggered");
  });
});

describe("onSavePng", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`generate a png onSave if pngGenerate option is set to true`, () => {
    cy.window().then(win => {
      cy.spy(win.console, "log");
    });
    cy.tgToggle("alwaysAllowSave");
    cy.tgToggle("generatePng");
    cy.get(`[data-test="saveTool"]`).click();
    cy.contains("onSave callback triggered");

    // TODO: Assert pngFile exists in opts and is of type Blob
  });
});

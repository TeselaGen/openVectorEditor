describe("demo", function () {
  it(`onPreviewModeFullscreenClose should work`, () => {
    cy.visit("#/Editor?withPreviewMode=true&onPreviewModeFullscreenClose=true");
    cy.contains("button", "Open Editor").click();
    cy.get(`.ve-close-fullscreen-button`).click();
    cy.contains(`onPreviewModeFullscreenClose hit -- Fullscreen Closed`);
  });
});

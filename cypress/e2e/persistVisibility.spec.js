describe("persistVisibility.spec", function () {
  it(`visibilities should be persisted through reloads`, () => {
    cy.visit("");
    cy.get(`.bp3-active [data-test="cutsiteHideShowTool"]`).click();
    cy.get(`.bp3-active [data-test="cutsiteHideShowTool"]`).should("not.exist");
    cy.triggerFileCmd("Feature Label");
    cy.reload();
    cy.get(`[data-test="cutsiteHideShowTool"]`).should("exist");
    cy.get(`.bp3-active [data-test="cutsiteHideShowTool"]`).should("not.exist");
    cy.triggerFileCmd("Feature Label", { noEnter: true });
    cy.get(`[cmd="toggleFeatureLabels"]`);
    cy.get(`[cmd="toggleFeatureLabels"] [icon="small-tick"]`).should(
      "not.exist"
    );
  });
});

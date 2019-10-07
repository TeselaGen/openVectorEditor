describe("rowView", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("right clicking the selection caret in the row view shouldn't lose selection ", function() {
    cy.selectRange(10, 20);
    cy.get(".veRowViewCaret.selectionLayerCaret")
      .first()
      .trigger("contextmenu");
    cy.contains("Selecting 11").should("exist"); //we should still have a selection
  });
  it("can jump to end and start in row view using the buttons", function() {
    cy.get("[data-test=jumpToEndButton]").click();
    cy.get("[data-test=jumpToStartButton]").click();
    cy.get("[data-test=jumpToEndButton]").click();
  });
  it("can click a feature multiple times and have the row view jump to the start and end of the feature", function() {
    cy.get(".veLabelText")
      .contains("GFPuv")
      .click();
    cy.get(".veRowViewCaret.veSelectionLayerStart");
    cy.get(".veLabelText")
      .contains("GFPuv")
      .click();
    cy.get(".veRowViewCaret.veSelectionLayerEnd");
    cy.get(".veLabelText")
      .contains("GFPuv")
      .click();
    cy.get(".veRowViewCaret.veSelectionLayerStart");
  });
});

describe("rowView", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it("inserting bps at the end of the seq shouldn't cause the new selection to wrap the origin by default", function () {
    cy.selectRange(5299, 5299);
    cy.get(
      ".veRowViewSelectionLayer:not(.cutsiteLabelSelectionLayer)"
    ).rightclick();
    cy.contains(".bp3-menu-item", "Replace").click();
    cy.focused().type("agagagagag{enter}");
    cy.contains("Selecting 10 bps from 5299 to 5308").should("exist");
  });
  it("right clicking the selection caret in the row view shouldn't lose selection ", function () {
    cy.selectRange(10, 20);
    cy.get(".veRowViewCaret.selectionLayerCaret")
      .first()
      .trigger("contextmenu");
    cy.contains("Selecting 11").should("exist"); //we should still have a selection
  });
  it("can jump to end and start in row view using the buttons", function () {
    cy.get("[data-test=jumpToEndButton]").click();
    cy.get("[data-test=jumpToStartButton]").click();
    cy.get("[data-test=jumpToEndButton]").click();
  });
  it("can click a feature multiple times (some while holding the alt key) and have the row view jump to the start and end of the feature", function () {
    cy.contains("text.veLabelText", "GFPuv").click();
    cy.contains(".veRowViewFeature text", "GFPuv");
    cy.get(".veRowViewCaret.veSelectionLayerStart");
    cy.contains("text.veLabelText", "GFPuv").click();
    cy.contains(".veRowViewFeature text", "GFPuv");
    cy.get(".veRowViewCaret.veSelectionLayerEnd").should("not.exist"); //shouldn't jump yet
    cy.contains("text.veLabelText", "GFPuv").click({ altKey: true });
    cy.contains(".veRowViewFeature text", "GFPuv");
    cy.get(".veRowViewCaret.veSelectionLayerEnd");
    cy.contains("text.veLabelText", "GFPuv").click({ altKey: true });
    cy.contains(".veRowViewFeature text", "GFPuv");
    cy.get(".veRowViewCaret.veSelectionLayerStart");
  });
});

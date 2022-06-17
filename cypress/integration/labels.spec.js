describe("label tests", () => {
  it(`the truncateLabelsThatDoNotFit should function correctly`, () => {
    cy.visit("/#/Editor?focusLinearView=true");
    cy.contains(".veLabelText", "pS8c-vector..");
    cy.tgToggle("truncateLabelsThatDoNotFit", false);
    cy.contains(".veLabelText", "GFPuv");
    cy.contains("veLabelText", "pS8c-vector..").should("not.exist");
  });
  it(`should show/hide a checkmark when toggling feature label visibility`, function () {
    cy.visit("");
    cy.contains(".veCircularViewLabelText", "araC");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Feature Labels`);
    cy.contains(".bp3-menu-item", "Feature Labels")
      .find(".bp3-icon-small-tick")
      .should("exist");
    cy.focused().type(`{enter}`);
    cy.contains(".bp3-menu-item", "Feature Labels")
      .find(".bp3-icon-small-tick")
      .should("not.exist");
    cy.contains(".veCircularViewLabelText", "araC").should("not.exist");
  });

  it(`should not initially show the option to toggle assembly piece labels`, function () {
    cy.visit("");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Assembly Piece Labels`);
    cy.contains(".bp3-menu-item", "Feature Labels").should("not.exist");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2").should(
      "not.exist"
    );
    cy.tgToggle("showAssemblyPieces");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Assembly Piece Labels`);
    cy.contains(".bp3-menu-item", "Assembly Piece Labels")
      .find(".bp3-icon-small-tick")
      .should("exist");
    cy.focused().type(`{enter}`);
    cy.contains(".bp3-menu-item", "Assembly Piece Labels")
      .find(".bp3-icon-small-tick")
      .should("not.exist");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2").should(
      "not.exist"
    );
  });
});

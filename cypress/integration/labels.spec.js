describe("label tests", () => {
  it(`label groups should function properly`, () => {
    cy.visit("#/Editor?showCicularViewInternalLabels=false");
    cy.get(`.veLabelText:contains(+4,Uba1122I)`).trigger("mouseover");
    cy.get(`.veLabelText.veAnnotationHovered:contains(Uba1122I)`);

    cy.get(`.veLabelText:contains(Aor51HI)`).trigger("mouseover");
    cy.get(`.veLabelText.veAnnotationHovered:contains(Aor51HI)`);
    cy.get(`.veLabelText:contains(+4,SbaI)`).trigger("mouseover");
    cy.get(`.veLabelText.veAnnotationHovered:contains(SbaI)`);
  });
  it(`the truncateLabelsThatDoNotFit should function correctly`, () => {
    cy.visit("/#/Editor?focusLinearView=true");
    cy.contains(".veLabelText", "pS8c-vector..");
    cy.tgToggle("truncateLabelsThatDoNotFit", false);
    cy.contains(".veLabelText", "GFPuv");
    cy.contains("veLabelText", "pS8c-vector..").should("not.exist");
  });
  it(`should show/hide a checkmark when toggling feature label visibility`, function () {
    cy.visit("#/Editor?showCicularViewInternalLabels=false");
    cy.contains(".veCircularViewLabelText", "araC");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Feature Labels`);
    cy.contains(".bp3-menu-item", "Feature")
      .find(".bp3-icon-small-tick")
      .should("exist");
    cy.focused().type(`{enter}`);
    cy.contains(".bp3-menu-item", "Feature")
      .find(".bp3-icon-small-tick")
      .should("not.exist");
    cy.contains(".veCircularViewLabelText", "araC").should("not.exist");
  });

  it(`should not initially show the option to toggle assembly piece labels`, function () {
    cy.visit("#/Editor?showCicularViewInternalLabels=false");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Assembly Piece Labels`);
    cy.contains(".bp3-menu-item", "Features").should("not.exist");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2").should(
      "not.exist"
    );
    cy.tgToggle("showAssemblyPieces");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2");
    cy.get("body").type("{meta}/");
    cy.focused().type(`Assembly Piece Labels`);
    cy.contains(".bp3-menu-item", "Assembly Pieces")
      .find(".bp3-icon-small-tick")
      .should("exist");
    cy.focused().type(`{enter}`);
    cy.contains(".bp3-menu-item", "Assembly Pieces")
      .find(".bp3-icon-small-tick")
      .should("not.exist");
    cy.contains(".veCircularViewLabelText", "Assembly Piece 2").should(
      "not.exist"
    );
  });
});

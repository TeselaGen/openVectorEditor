describe("StandaloneAlignment", function () {
  it("it should have both parts and features shown by default (via passed in alignmentAnnotationVisibility) and still show the sequence", function () {
    cy.visit("#/StandaloneAlignment");
    cy.get(".veRowViewPart").should("exist");
    cy.get(".veRowViewFeature").should("exist");
    cy.get(".rowViewTextContainer").should("exist");
  });
});

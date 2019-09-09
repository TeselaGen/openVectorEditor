describe("editor", function() {
  beforeEach(() => {
    cy.visit("#/Alignment");
  });

  it("can drag the alignment", function() {
    cy.get(".veRowViewSelectionLayer")
      .first()
      .should("not.be.visible");

    cy.tgToggle("isFullyZoomedOut");
    cy.contains("text", "355")
      .first()
      .then(el => {
        cy.contains("text", "710")
          .first()
          .then(el2 => {
            cy.dragBetween(el, el2);
          });
      });
    cy.get(".veRowViewSelectionLayer")
      .first()
      .should("be.visible");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

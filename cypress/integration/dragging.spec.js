describe("dragging", () => {
  beforeEach(() => {
    cy.visit("");
  });
  // it("can drag the editor", function() {
  //   cy.contains("No Selection");
  //   cy.dragBetweenSimple(`[data-row-number="0"]`, `[data-row-number="1"]`);
  //   cy.contains("No Selection").should("not.exist");
  // });

  it(`should handle dragging correctly`, () => {
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(100);
    cy.get(".veRowViewAxis path")
      .eq(1)
      .then(el => {
        cy.get(".veRowViewAxis path")
          .eq(2)
          .then(el2 => {
            cy.dragBetweenSimple(el, el2);
          });
      });
    cy.wait(100);

    cy.get(`[title="Caret Between Bases 19 and 20"]`).then(el => {
      cy.get(".veRowViewAxis path")
        .eq(5)
        .then(el2 => {
          cy.dragBetweenSimple(el, el2);
        });
    });

    cy.contains("Selecting 30 bps from 10 to 39");
    cy.wait(100);

    cy.get(".veRowViewAxis path")
      .eq(6)
      .then(el => {
        cy.get(".veRowViewAxis path")
          .eq(7)
          .then(el2 => {
            cy.dragBetweenSimple(el, el2);
          });
      });
    cy.contains("Selecting 10 bps from 50 to 59");
    /* eslint-enable */
  });
});

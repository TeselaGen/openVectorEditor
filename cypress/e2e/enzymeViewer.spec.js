describe("enzymeViewer", function () {
  beforeEach(() => {
    cy.visit("#EnzymeViewer");
  });
  it(`should display an enzyme by default`, () => {
    cy.get(".ve-row-item-sequence");
    cy.get(".veRowViewCutsite.snip");
    cy.contains(".ve-row-item-sequence", "ggtctc");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

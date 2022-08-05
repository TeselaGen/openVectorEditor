describe("allowPrimerBasesToBeEdited", function () {
  it(`unchecking 'Linked Oligo?' should cause the bases to not be shown on the primer`, () => {
    cy.visit("http://localhost:3344/#/Editor?allowPrimerBasesToBeEdited=true");
    cy.contains("Example Primer 1").dblclick({ force: true });
    cy.get(".tg-primer-bases");
    cy.contains("Linked Oligo?").click();
    cy.get(".tg-primer-bases").should("not.exist");
  });
});

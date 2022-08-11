describe("allowPrimerBasesToBeEdited", function () {
  it(`unchecking 'Linked Oligo?' should cause the bases to not be shown on the primer`, () => {
    cy.visit("http://127.0.0.1:5173/#/Editor?allowPrimerBasesToBeEdited=true");
    cy.contains("Example Primer 1").dblclick({ force: true });
    cy.get(".tg-primer-bases");
    cy.contains("Linked Oligo?").click();
    cy.get(".tg-primer-bases").should("not.exist");
  });
});

describe("miscellaneous tests that do not fit other categories", () => {
  it(`typing in middle of input should not jump cursor to end of text (react-easy-state bug)`, () => {
    cy.visit("");
    cy.get("body").type("{meta}/");
    cy.focused()
      .type("yyyyy{leftarrow}{leftarrow}{leftarrow}xxxx")
      .should("have.value", "yyxxxxyyy");
  });
});

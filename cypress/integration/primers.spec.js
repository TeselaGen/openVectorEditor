describe("primers.spec", () => {
  it(`should be able to specify bases for a given primer`, function () {
    cy.visit("");
    cy.selectRange(30, 90);
    cy.triggerFileCmd("New Primer");
  });
});

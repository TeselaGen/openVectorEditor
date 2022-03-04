describe("initialAnnotationToEdit", function () {
  it(`should be able to pass an initialAnnotationToEdit`, () => {
    cy.visit("#/Editor?initialAnnotationToEdit=true");
    cy.contains(".bp3-dialog", "Edit Part");
    cy.contains(".bp3-dialog", "status: ready");
  });
});

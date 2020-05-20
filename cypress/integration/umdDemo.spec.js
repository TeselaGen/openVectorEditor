describe("umd demo", function() {
  it(`the umd demo should load and show the editor`, () => {
    cy.visit("/UMDDemo.html");
    cy.contains(".veLabelText", "I'm a feat");
    cy.get(".veEditor");
  });
});

describe("umd demo", function () {
  it(`the umd demo should load and show the editors`, () => {
    cy.visit("/UMDDemo.html");
    cy.contains("Untitled Sequence");
    cy.contains("Another Sequence");
    cy.contains("Wait for Me!");
    cy.contains(".veLabelText", "2nd Featur..");
  });
});

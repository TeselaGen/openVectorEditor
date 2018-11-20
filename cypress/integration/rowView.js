describe("toolbar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can jump to end and start in row view using the buttons", function() {
    cy.get("[data-test=jumpToEndButton]").click();
    cy.get("[data-test=jumpToStartButton]").click();
  });
});

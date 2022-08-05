describe("versionHistory", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it("should be accessible from the demo", function () {
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Revision History").click();
    cy.contains("Past Versions");
    cy.contains(".bp3-button", "Revert to Selected").should(
      "have.class",
      "bp3-disabled"
    );
    cy.contains("Nara").click();
    cy.contains(".bp3-button", "Revert to Selected")
      .should("not.have.class", "bp3-disabled")
      .click();
    cy.contains(".bp3-toast", "onSave callback triggered");
    cy.contains(".bp3-button", "Revert to Selected").should("not.exist");
  });
});

describe("getAdditionalCreateOpts.spec", function () {
  it("passing a getAdditionalCreateOpts function should allow for additional options to be specified under the Create > XXXX right click menu", function () {
    cy.visit("");
    cy.tgToggle("withGetAdditionalCreateOpts");
    cy.contains(".veLabelText", "Part 0").rightclick();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "Additional Create Option").click();
    cy.contains("Selecting between 10 : 30");
  });
});

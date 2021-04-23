describe("demo", function () {
  it(`users should be able to search the options in the demo`, () => {
    cy.visit("");
    cy.contains(`.toggle-button-holder`, "isProtein").should("exist");
    cy.get(`[placeholder="Search Options.."]`).type("Custom");
    cy.contains(`.toggle-button-holder`, "isProtein").should("not.exist");
    cy.contains(`.toggle-button-holder`, "Customize property tabs").should(
      "exist"
    );
  });
});

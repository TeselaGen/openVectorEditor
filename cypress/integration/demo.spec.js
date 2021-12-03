describe("demo", function () {
  it(`users should be able to search the options in the demo`, () => {
    cy.visit("");
    cy.contains(`.toggle-button-holder`, "Show Rotate Circular View").should(
      "exist"
    );
    cy.get(`[placeholder="Search Options.."]`).type("Custom");
    cy.contains(`.toggle-button-holder`, "Show Rotate Circular View").should(
      "not.exist"
    );
    cy.contains(`.toggle-button-holder`, "Customize property tabs").should(
      "exist"
    );
  });
  it(`demo options should persist even if "Show Demo Options" is unchecked`, () => {
    cy.visit("#/Editor?showDemoOptions=false&moleculeType=Protein");
    cy.contains("pj5_00001");
    cy.contains("Length: 1384 AAs");
    cy.contains(`Length: 5299 bps`).should("not.exist");
  });
});

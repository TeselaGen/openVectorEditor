describe("rotateCircularView", function () {
  it(`should be able to rotate the circular view`, () => {
    cy.visit("");
    cy.get(`[transform="rotate(180) translate(0, -15)"]`)
      .contains("4770")
      .should("not.exist");
    cy.get(".bp3-slider-track").click();
    //the tick with label 4770 should be rotated 180
    cy.get(`[transform="rotate(180) translate(0, -15)"]`)
      .contains("4770")
      .should("exist");
  });
});

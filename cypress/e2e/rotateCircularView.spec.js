describe("rotateCircularView", function () {
  it(`should be able to rotate the circular view`, () => {
    cy.visit("");

    cy.get(`[style="transform: rotate(180deg);"]`).should("not.exist");
    cy.get(".veRotateCircularSlider").click();
    //after clicking the middle of the rotate slider we should have a rotation of 180
    cy.get(`[style="transform: rotate(180deg);"]`);
    cy.get(`[style="transform: rotate(177deg);"]`).should("not.exist");
    cy.get(".veRotateCircularSlider .bp3-icon-arrow-right").click();
    cy.get(`[style="transform: rotate(177deg);"]`);
  });
});

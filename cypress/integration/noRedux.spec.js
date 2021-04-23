describe("noRedux", function () {
  it(`should be able to view the SimpleCircularOrLinearViewNoRedux route and have everything work outside of a redux context if noRedux=true is passed`, () => {
    cy.visit("#SimpleCircularOrLinearViewNoRedux");
    cy.get(".veCircularView");
    cy.get(".veLinearView");
  });
});

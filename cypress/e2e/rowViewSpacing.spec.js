describe("rowViewSpacing.spec", function () {
  beforeEach(() => {
    cy.visit("/");
  });
  it(`should be able to modify the spacing of the row view`, () => {
    cy.get(".veRowView");
    cy.triggerFileCmd("Spacing", { noEnter: true });
    cy.get(`.bp3-slider-handle .bp3-slider-label:contains(9)`);
    cy.get(`[data-row-number="0"] [data-tick-mark="50"]`);
    //upon increasing spacing, the axis tick mark 50 should no longer be on the 1st row!
    cy.get(`.bp3-slider-label:contains(14)`).click().should("exist");
    cy.get(`[data-row-number="0"] [data-tick-mark="50"]`).should("not.exist");
    //upon decreasing spacing, the axis tick mark 50 should be on the 1st row again!
    cy.get(`.bp3-slider-label:contains(8)`).click();
    cy.get(`[data-row-number="0"] [data-tick-mark="50"]`).should("exist");
  });
});

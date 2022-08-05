describe("cutsiteInfoView", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`meta/cmd clicking a cutsite should cause it to select the recognition site`, () => {
    cy.contains(".veLabelText", "AatII").click({ cmdKey: true });
    cy.contains("Selecting 6 bps from 1 to 6");
  });
  it(`option/alt clicking a cutsite should cause it to select the cutsite bottom snip`, () => {
    cy.contains(".veLabelText", "AatII").click({ altKey: true });
    cy.contains("Caret Between Bases 1 and 2");
  });
  it(`regular clicking a cutsite should cause it to select the cutsite top snip`, () => {
    cy.contains(".veLabelText", "AatII").click();
    cy.contains("Caret Between Bases 5 and 6");
  });
});

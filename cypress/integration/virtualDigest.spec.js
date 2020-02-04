describe("virtualDigest", function() {
  beforeEach(() => {
    cy.visit("#Editor");
  });
  it(`should show a warning if too many cutsites are visible`, () => {
    cy.triggerFileCmd("Digest");
    cy.get(`.bp3-multi-select [data-icon="small-cross"`).click();
    cy.contains(
      ">50 cutsites detected. Filter out additional restriction enzymes to visualize digest results"
    );
    cy.contains("Disabled (only supports 10 or fewer cutsites)");
  });
});

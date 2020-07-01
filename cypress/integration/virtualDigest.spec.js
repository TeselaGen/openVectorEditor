describe("virtualDigest", function () {
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
  it(`should give a right click create feature/part option and have the annotation name autofilled`, () => {
    cy.triggerFileCmd("Digest");
    cy.get(`[data-test="AvrII -- BlnI 5299 bps"]`).rightclick();
    cy.contains(".bp3-menu-item", "New Part").click();
    cy.get(`.tg-test-name input`).should(
      "have.value",
      `AvrII -- BlnI 5299 bps`
    );
  });
  it(`clicking a fragment in the Digest Table view and then right clicking the selection to create a feature should have the annotation name autofilled`, () => {
    cy.triggerFileCmd("Digest");
    cy.contains(".bp3-tab", "Digest Info").click();
    cy.contains(".rt-td", "AvrII").click();
    cy.get(".veSelectionLayer").first().rightclick();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click();

    cy.get(`.tg-test-name input`).should("have.value", `PvuI -- AvrII 151 bps`);
  });
});

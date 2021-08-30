describe("virtualDigest", function () {
  beforeEach(() => {
    cy.visit("#Editor");
  });
  it(`users should be able to choose between multiple ladders`, () => {
    cy.triggerFileCmd("Digest");
    cy.contains("20000 bp");
    cy.contains("15000 bp").should("not.exist");
    cy.contains(".tg-select-value", "GeneRuler 1kb + DNA 75-20,000 bp");
    cy.get(".tg-single-select").click();
    cy.contains("Invitrogen 1kb").click();
    cy.contains(".tg-select-value", "GeneRuler 1kb + DNA 75-20,000 bp").should(
      "not.exist"
    );
    cy.contains(".tg-select-value", "Invitrogen 1kb").should("exist");
    cy.contains("15000 bp");
  });
  it(`should show a warning if too many cutsites are visible`, () => {
    cy.triggerFileCmd("Digest");
    cy.get(`.bp3-multi-select [data-icon="small-cross"`).click();
    cy.contains(
      ">50 cut sites detected. Filter out additional restriction enzymes to visualize digest results"
    );
    cy.contains("Disabled (only supports 10 or fewer cut sites)");
  });
  it(`should give a right click create feature/part option and have the annotation name autofilled`, () => {
    cy.triggerFileCmd("Digest");
    cy.get(`[data-test="Pae17kI -- Cfr6I 5299 bps"]`).rightclick();
    cy.contains(".bp3-menu-item", "New Part").click({ force: true });
    cy.get(`.tg-test-name input`).should(
      "have.value",
      `Pae17kI -- Cfr6I 5299 bps`
    );
  });
  it(`clicking a fragment in the Digest Table view and then right clicking the selection to create a feature should have the annotation name autofilled`, () => {
    cy.triggerFileCmd("Digest");
    cy.contains(".bp3-tab", "Digest Info").click();
    cy.contains(".rt-td", "AvrII").click();
    cy.get(".veSelectionLayer").first().rightclick();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click({ force: true });

    cy.get(`.tg-test-name input`).should(
      "have.value",
      `BlnI -- AvrII 5299 bps`
    );
  });
});

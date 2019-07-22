describe("properties", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`a custom properties tab should be able to be added`, () => {
    cy.tgToggle("propertiesOverridesExample");
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="Custom"]`).click();
    cy.contains(".ve-propertiesPanel", "Hello World, I am a Custom Tab");
    cy.contains(".ve-propertiesPanel", "sequenceLength: 5299");
  });
  it(`can change to linear mode via the general properties panel and get a warning that annotations will be truncated`, () => {
    cy.get(".veTabProperties").click();
    cy.get(".circularLinearSelect select").select("Linear");
    cy.contains(".bp3-dialog", "Truncate Annotations").should("be.visible");
  });
  it(`we should be able to view and edit a description in general properties 
  and have that visible within the genbank view as well`, () => {
    cy.get(".veTabProperties").click();
    cy.get(`.tg-test-description`)
      .contains("Edit")
      .click();
    cy.get(`.tg-test-description textarea`).type(
      "Test description{cmd}{enter}"
    );
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("DEFINITION  Test description");
    cy.get(`[data-tab-id="general"]`).click();
    cy.get(`.tg-test-description`)
      .contains("Edit")
      .click();
    cy.get(`.tg-test-description textarea`).clear();
    cy.get(`.tg-test-description`)
      .contains("Ok")
      .click();
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("DEFINITION").should("not.exist");
  });
  it("can click into the orf properties tab and change the minimum orf size and trigger a warning in the editor", function() {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.get(`[data-test="min-orf-size"]`)
      .find("input")
      .type("{selectall}30");
    cy.get(`[data-test="ve-warning-maxOrfsToDisplay"]`);
  });
  it("can view the orf properties checkboxes even when the window height is small ", function() {
    cy.viewport(1000, 500);
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.contains("Use GTG And CTG As Start Codons")
      .scrollIntoView()
      .should("be.visible");
    // cy.scrollIntoView("")
  });
  it(`
  -can select all in the genbank properties window //todo
  -has a Part 0 in the genbank
  `, function() {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="genbank"]`).click();
    //todo comment this in once select all is working with cypress
    //cy.get(`[data-test="ve-genbank-text"]`).click().type("{meta}a")
    //Part 0 should be in there
    cy.get(`[data-test="ve-genbank-text"]`).contains("Part 0");
  });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })

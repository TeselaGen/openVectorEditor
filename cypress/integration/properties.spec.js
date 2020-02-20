describe("properties", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`creating a primer should create a primer in the genbank at the selected range`, () => {
    cy.selectRange(10, 20);
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="primers"]`).click();
    cy.contains(".vePropertiesFooter button", "New").click();
    cy.get(`input[value="10"]`); //by default we should be selecting from 10 to 20
    cy.get(`input[value="20"]`);
    cy.focused()
      .type("fakeprimer")
      .closest(".bp3-dialog")
      .contains("Save")
      .click();
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("textarea", `primer          complement(10..20)`);
    cy.contains("textarea", `/label="fakeprimer"`);
  });
  it(`should be able to delete a feature from the properties tab and not have the delete button still enabled; 
   - have the number of features correctly displayed
   -not be able to create a new feature if sequenceLength === 0`, () => {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="features"]`).click();
    cy.contains(".data-table-title-and-buttons", "Show Features");
    cy.contains(".data-table-title-and-buttons", "22");
    cy.contains(".ve-propertiesPanel button", "Delete").should(
      "have.class",
      "bp3-disabled"
    );
    cy.contains(".ReactTable", "araC").click();
    cy.contains(".ve-propertiesPanel button", "Delete")
      .should("not.have.class", "bp3-disabled")
      .click();

    cy.contains(".ve-propertiesPanel button", "Delete").should(
      "have.class",
      "bp3-disabled"
    );

    cy.contains(".vePropertiesFooter button", "New").should(
      "not.have.class",
      "bp3-disabled"
    );
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select All")
      .click();
    cy.get(".veSelectionLayer")
      .first()
      .trigger("contextmenu", { force: true });
    cy.get(".bp3-menu-item")
      .contains("Cut")
      .click();
    cy.contains(".vePropertiesFooter button", "New").should(
      "have.class",
      "bp3-disabled"
    );
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
  it(`can right click multiple of the same cutsite type (FokI) 
  and have the cutsite properties table jump to the correct cutsite`, () => {
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(".tg-select-clear-all").click();
    cy.contains(".veLabelText", "+3,FokI").rightclick();
    cy.contains(".bp3-menu-item", "View Cutsite Properties").click();
    cy.contains(".rt-tr-group.selected", "4975");
    cy.contains(".veLabelText", "+2,FokI").rightclick();
    cy.contains(".bp3-menu-item", "View Cutsite Properties").click();
    cy.contains(".rt-tr-group.selected", "642");
  });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })

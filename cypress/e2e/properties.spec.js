describe("properties", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`creating a primer should create a primer in the genbank at the selected range`, () => {
    cy.selectRange(10, 20);
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="primers"]`).click();
    cy.get(".tgNewAnnBtn").click();
    cy.get(`input[value="10"]`); //by default we should be selecting from 10 to 20
    cy.get(`input[value="20"]`);
    cy.focused().type("fakeprimer");

    //should default to forward strand,
    cy.get(`[name="forward"]:first[value="true"]`);
    cy.get(`[name="forward"]:last[value="true"]`).should("not.exist");
    //flip it to the reverse strand
    cy.get(`[name="forward"]:last[value="false"]`).click({ force: true });
    cy.get(".bp3-dialog").contains("Save").click();
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("textarea", `primer_bind complement(10..20)`);
    cy.contains("textarea", `/label="fakeprimer"`);
  });
  it(`should be able to delete a feature from the properties tab and not have the delete button still enabled; 
   - have the number of features correctly displayed
   -not be able to create a new feature if sequenceLength === 0`, () => {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="features"]`).click();
    cy.get(".propertiesVisFilter").click();
    cy.get(".bp3-menu-item:contains(Features):contains(22)");
    cy.get(`.tgDeleteAnnsBtn`).should("have.class", "bp3-disabled");
    cy.contains(".ReactTable", "araC").click();
    cy.get(`.tgDeleteAnnsBtn`).should("not.have.class", "bp3-disabled").click();

    cy.get(`.tgDeleteAnnsBtn`).should("have.class", "bp3-disabled");

    cy.get(".tgNewAnnBtn").should("not.have.class", "bp3-disabled");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select All").click();
    cy.get(".veSelectionLayer").first().trigger("contextmenu", { force: true });
    cy.get(".bp3-menu-item").contains("Cut").click();
    cy.get(".tgNewAnnBtn").should("have.class", "bp3-disabled");
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
  and have that visible within the genbank view as well we should be able to edit a description in general properties, not make any changes, hit ok, and have the description not clear (bug! https://github.com/TeselaGen/lims/issues/5492)
  // and have that visible within the genbank view as well`, () => {
    cy.get(".veTabProperties").click();
    cy.get(`.tg-test-description`).contains("Edit").click();
    cy.get(`.tg-test-description textarea`).type(
      "Test description{cmd}{enter}"
    );
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("DEFINITION Test description");
    cy.get(`[data-tab-id="general"]`).click();
    cy.get(`.tg-test-description`).contains("Edit").click();
    cy.get(`.tg-test-description`).contains("Ok").click();
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("DEFINITION Test description");
    cy.get(`[data-tab-id="general"]`).click();
    // cy.pause()

    cy.get(`.tg-test-description`).contains("Edit").click();
    cy.get(`.tg-test-description textarea`).clear();
    cy.get(`.tg-test-description`).contains("Ok").click();
    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("DEFINITION").should("not.exist");
  });
  // it(`we should be able to edit a description in general properties, not make any changes, hit ok, and have the description not clear (bug! https://github.com/TeselaGen/lims/issues/5492)
  // and have that visible within the genbank view as well`, () => {
  //   cy.get(".veTabProperties").click();
  //   cy.get(`.tg-test-description`)
  //     .contains("Edit")
  //     .click();

  //   cy.get(`.tg-test-description`)
  //     .contains("OK")
  //     .click();

  //   cy.get(`.tg-test-description textarea`).type(
  //     "Test description{cmd}{enter}"
  //   );
  //   cy.get(`[data-tab-id="genbank"]`).click();
  //   cy.contains("DEFINITION Test description");
  //   cy.get(`[data-tab-id="general"]`).click();
  //   cy.get(`.tg-test-description`)
  //     .contains("Edit")
  //     .click();
  //   cy.get(`.tg-test-description textarea`).clear();
  //   cy.get(`.tg-test-description`)
  //     .contains("Ok")
  //     .click();
  //   cy.get(`[data-tab-id="genbank"]`).click();
  //   cy.contains("DEFINITION").should("not.exist");
  // });
  it("can click into the orf properties tab and change the minimum orf size and trigger a warning in the editor", function () {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.get(".propertiesVisFilter").click();
    cy.get(`[data-test="min-orf-size"]`).find("input").type("{selectall}30");
    cy.get(`[data-test="ve-warning-maxOrfsToDisplay"]`);
  });
  it("can view the orf properties checkboxes even when the window height is small ", function () {
    cy.viewport(1000, 500);
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.get(`.propertiesVisFilter`).click();
    cy.contains("Use GTG And CTG As Start Codons")
      .scrollIntoView()
      .should("be.visible");
    // cy.scrollIntoView("")
  });
  it(`
  -can select all in the genbank properties window //todo
  -has a Part 0 in the genbank
  `, function () {
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="genbank"]`).click();
    //todo comment this in once select all is working with cypress
    //cy.get(`[data-test="ve-genbank-text"]`).click().type("{meta}a")
    //Part 0 should be in there
    cy.get(`[data-test="ve-genbank-text"]`).contains("Part 0");
  });
  it(`can right click multiple of the same cutsite type (FokI) and have the cutsite properties table jump to the correct cutsite`, () => {
    cy.get(".ve-tool-container-cutsiteTool .veToolbarDropdown").click();
    cy.get(".tg-select-clear-all").click();
    cy.get(`.veToolbarCutsiteFilterHolder .tg-select`).click();
    cy.contains(".tg-select-option", "Van").click();
    cy.get(".veLabelText:contains(Van):first").rightclick();
    cy.contains(".bp3-menu-item", "View Cut Site Properties").click();
    cy.contains(".rt-tr-group.selected", "831");
    cy.get(".veLabelText:contains(Van):last").rightclick();
    cy.contains(".bp3-menu-item", "View Cut Site Properties").click();
    cy.contains(".rt-tr-group.selected", "4730");
  });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })

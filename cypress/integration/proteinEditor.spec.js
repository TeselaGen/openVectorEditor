describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
    cy.tgToggle("isProtein");
  });

  it(`should 
  -not show circularity
  -not show cutsite/orf tools
  `, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).should("not.exist");
    cy.get(`[data-test="orfTool"]`).should("not.exist");

    cy.get(".veStatusBar-circularity").should("not.exist");
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="parts"]`);
    cy.get(`[data-tab-id="orfs"]`).should("not.exist");
    cy.get(`[data-tab-id="cutsites"]`).should("not.exist");
    cy.get(`[data-tab-id="translations"]`).should("not.exist");
    cy.get(".ve-propertiesPanel")
      .contains("Circular")
      .should("not.exist");
  });

  it(`should 
  -show the AA count
  -the protein seq should be the primary sequence displayed
  -not show any dna sequence by default 
  -should not show options to update restriction enzymes or simulate digestion
  -not show options to view cutsites, orfs, translations, full sequence translations
  -be able to hide/show the underlying dna sequence
  `, function() {
    cy.log("show the AA count");
    cy.contains("4152 AAs");

    cy.log("the protein seq should be the primary sequence displayed");
    cy.get(".primaryProteinSequence");

    cy.log("not show any dna sequence by default ");
    cy.get(".ve-row-item-sequence").should("not.exist");

    cy.get(".tg-menu-bar")
      .contains("Tools")
      .click();

    cy.log(
      "should not show options to update restriction enzymes or simulate digestion"
    );
    cy.get(".bp3-menu")
      .contains("Restriction Enzymes Manager")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Simulate Digestion")
      .should("not.exist");

    cy.log("not show options to view cutsites, orfs, translations ");
    cy.get(".tg-menu-bar")
      .contains("View")
      .click();
    cy.get(".bp3-menu")
      .contains("ORFs")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Translations")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Full Sequence Translation")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Sequence Case")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Cutsites")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Cutsite Labels")
      .should("not.exist");
    cy.log("be able to hide/show the underlying dna sequence");
    cy.get(`[cmd="toggleSequence"]`).click();
    cy.get(".ve-row-item-sequence").should("exist");
  });
});

// * change AA sequence to the primary sequence
// * [x]  allow the sequence to be hidden
// * [x]  **tricky** derive the degenerate dna sequence from the AA sequence (more thought required here..)
// * [x]  remove "view/delete translation"
// * [ ]  remove translation properties panel
// * [x]  hide/disable cutsites by default
// * [ ]  rename plasmid --> circular view
// * [ ]  disable restriction enzyme manager/ simulate digestion
// * [ ]   **semi-tricky**  copy/paste/cut/insert/delete/select should all act on the AA sequence
// * [ ]  selecting x bps -->selecting x AA's
// * [ ]  axis numbering needs to change
// * [ ]  hide/disable ORFs
// * [ ]  **semi-tricky** import and export need to support AA's by default
// * [ ]  find should search for AA by default
// * [ ]  go to should jump to the AA number
// * [ ]  hide reverse complement
// * [ ]  hide full sequence case
// * [ ]  hide sequence case
// * [ ]  saving needs to pass AA sequence as default

describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
    cy.tgToggle("isProtein");
  });
  it(`can move the caret around correctly`, () => {
    cy.contains(".veRowViewPrimaryProteinSequenceContainer svg g", "M").click({
      force: true
    });
    cy.get(".veVectorInteractionWrapper")
      .first()
      .type("{rightarrow}{rightarrow}{rightarrow}");
    cy.contains("Caret Between AAs 3 and 4");
  });
  it(`
  -can find AA's by default in the search bar
  
  `, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`)
      .click()
      .focused()
      .type("mmh");
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();

    cy.get(`[name="dnaOrAA"]`).select("DNA");
    cy.get(".veSearchLayerContainer").should("not.exist");
    cy.get(`[name="dnaOrAA"]`).select("Amino Acids");

    cy.get(".veSearchLayerContainer.notCaret").click({ force: true });
    cy.contains("Selecting 3 AAs from 1 to 3");
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.get(`[name="ambiguousOrLiteral"]`).select("Ambiguous");
    cy.get(".veFindBar input").type("xx");
    cy.get(".veSearchLayerContainer.notCaret").click({ force: true });
    cy.contains("Selecting 5 AAs from 1 to 5");
  });
  it(`should 
  -has 1, 5, 10 AA's in the rowview axis
  -can click an AA and have the selecting message display correctly
  -not show circularity/cutsite/orf/translations tools or properties
  `, () => {
    cy.log("-has 1, 5, 10 AA's in the rowview axis");
    cy.contains(".veRowViewAxis", "1");
    cy.contains(".veRowViewAxis", "5");
    cy.contains(".veRowViewAxis", "10");

    cy.log("-can click an AA and have the selecting message display correctly");
    cy.contains(".veRowViewPrimaryProteinSequenceContainer svg g", "M").click({
      force: true
    });
    cy.contains("Selecting 1 AAs from 1 to 1");
    cy.contains("Length: 1384 AAs");

    cy.log(
      "-not show circularity/cutsite/orf/translations tools or properties"
    );
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
    cy.get(".veRowViewPrimaryProteinSequenceContainer");

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

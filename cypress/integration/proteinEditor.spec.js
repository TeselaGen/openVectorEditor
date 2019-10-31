describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
    cy.tgToggle("isProtein");
  });
  it(`should have non protein actions hidden from the menu search`, () => {
    cy.get("body").type("{meta}/");
    cy.focused().type("translation{enter}");
    cy.contains(".bp3-menu-item", "Translations").should("not.exist");
  });
  it(`should be able to toggle between protein and dna mode after firing some actions`, () => {
    cy.contains(".veLabelText", "Part 0").click();
    cy.tgToggle("isProtein", false);
    cy.contains("Length: 5299 bps").should("exist");
  });
  it(`feature/part add/edit should be AA indexed`, () => {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click();
    cy.focused().type("NF");
    cy.get(`.tg-test-start input[value="1"]`);
    cy.get(`.tg-test-end [value="1"]`);
    cy.get(`.tg-test-end [icon="chevron-up"]`).click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veRowViewFeature", "NF").click({ force: true });
    cy.contains("Selecting 2 AAs from 1 to 2");

    cy.get(".veLabelText")
      .contains("araC")
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Edit Feature").click();
    cy.get(`.tg-test-locations-2-start input[value="501"]`);
    cy.contains("Add Joined Feature Span").click();
    cy.get(`.tg-test-locations-3-start input[value="886"]`).type(
      "{selectall}3"
    );
    cy.get(`.tg-test-locations-3-end input[value="886"]`).type("{selectall}3");
    cy.contains(".bp3-dialog button", "Save").click();
    cy.get(`.tg-test-locations-3-end .bp3-intent-danger`).should("exist");
    cy.closeDialog();

    cy.get(".veLabelText")
      .contains("Part 0")
      .trigger("contextmenu", { force: true });
    cy.contains("Edit Part").click();
    cy.get(`.tg-test-start input[value="11"]`);
    cy.get(`.tg-test-end [value="31"]`);
  });
  it(`should be able to insert AAs correctly via typing in the editor`, () => {
    cy.contains(".veRowViewPrimaryProteinSequenceContainer svg g", "M").click({
      force: true
    });
    cy.get(".veVectorInteractionWrapper")
      .first()
      .type("{rightarrow}{rightarrow}");
    cy.get(".veRowViewCaret").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Insert").click();
    cy.contains("Press ENTER to insert 0 AAs after AA 2");
    cy.get(".sequenceInputBubble input").type("{enter}");
    //we don't want to see the insert successful message because no bps were entered
    cy.contains("Sequence Inserted Successfully").should("not.exist", {
      timeout: 1000
    });

    cy.contains(".veRowViewPrimaryProteinSequenceContainer svg g", "M").click({
      force: true
    });
    cy.get(".veRowViewSelectionLayer.notCaret").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type(".*-masdzz,");
    cy.contains("Press ENTER to replace 1 AAs between 1384 and 2");
    cy.get(".sequenceInputBubble input").type("{enter}");
    cy.contains("Selecting 9 AAs from 1 to 9");
    cy.contains("Length: 1392 AAs");
    cy.get(`[data-test="ve-find-tool-toggle"]`)
      .click()
      .focused()
      .type(".*-ma");

    cy.get(`[title="Selecting 5 AAs from 1 to 5"]`).should("exist");
  });
  it(`should be able to delete correctly when backspace/del pressed`, () => {
    cy.contains(".veRowViewPrimaryProteinSequenceContainer svg g", "M").click({
      force: true
    });
    cy.get(".veVectorInteractionWrapper")
      .first()
      .type("{rightarrow}{backspace}");
    cy.contains("Caret Between AAs 1383 and 1");
    cy.contains("Length: 1383 AAs");
  });
  it(`should be able to cut /* todo: and paste */ correctly`, () => {
    cy.get(".veRowViewPartsContainer")
      .contains("Part 0")
      .first()
      .click({ force: true });
    cy.get(".veRowViewSelectionLayer")
      .first()
      .trigger("contextmenu", { force: true });
    cy.get(".bp3-menu-item")
      .contains("Cut")
      .click();
    cy.get(".bp3-toast .bp3-icon-cross")
      .first()
      .click();
    cy.get(`[data-test="ve-find-tool-toggle"]`)
      .click()
      .focused()
      // .type("{meta}v")
      .type("lpl");
    cy.get(`[title="Selecting 3 AAs from 10 to 12"]`).should("exist");

    cy.get(".veSearchLayerContainer.notCaret").click({ force: true });
  });

  it("should be able to select a range (10 - 20) via Edit > Select and have the range correctly selected", function() {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`[label="From:"]`)
      .clear()
      .type("10");
    cy.get(`[label="To:"]`)
      .clear()
      .type("20");
    cy.get(".tg-min-width-dialog")
      .contains("Select 11 AAs")
      .click();
    cy.get(".veStatusBarItem")
      .contains("Selecting 11 AAs from 10 to 20")
      .should("be.visible");
  });

  it(`goTo, rotateTo work
  -can't go to a position outside of the sequence
  -can go to a position inside the sequence 
  // -can rotate the sequence to that position
  `, () => {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Go To")
      .click();
    cy.focused()
      .clear()
      .type("0");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.enabled");
    cy.focused()
      .clear()
      .type("1384");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.enabled");
    cy.focused()
      .clear()
      .type("2000000");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.disabled");
    cy.focused()
      .clear()
      .type("20");
    cy.get(".bp3-dialog")
      .contains("OK")
      .click();
    cy.contains("Caret Between AAs 20 and 21");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    // cy.get(".tg-menu-bar-popover")
    //   .contains("Rotate To Caret Position")
    //   .click();
    // cy.contains("Caret Between AAs 1384 and 1");
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
    cy.contains("Selecting 1 AA from 1 to 1");
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
    cy.get(".ve-propertiesPanel").contains("1384");
    //features and parts are correctly indexed in the properties panel
    cy.get(`[data-tab-id="features"]`).click();
    cy.contains(".rt-td", "879");
    cy.contains(".rt-td", "(7-25)");
    cy.contains(".rt-td", "(29-49)");
    cy.contains(".rt-td", "(501-885)");
    cy.get(`[data-tab-id="parts"]`).click();
    cy.contains(".rt-td", "21");
    cy.contains(".rt-td", "(11-31)");

    cy.get(`[data-tab-id="genbank"]`).click();
    cy.contains("protein_bind    1124..1162");
    cy.contains("complement(join(7..25,29..49,501..885))");
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
    cy.contains("1384 AAs");

    cy.log("the protein seq should be the primary sequence displayed");
    cy.get(".veRowViewPrimaryProteinSequenceContainer");

    cy.log("not show any dna sequence by default ");
    cy.get(".ve-row-item-sequence").should("not.exist");

    cy.log(
      "should not show options to update restriction enzymes or simulate digestion"
    );
    cy.get(".tg-menu-bar")
      .contains("Tools")
      .should("not.exist");

    //comment this in again once the tools menu exists again
    // cy.contains(".bp3-menu", "Restriction Enzymes Manager")
    //   .should("not.exist");
    // cy.contains(".bp3-menu", "Simulate Digestion")
    //   .should("not.exist");

    cy.log("not show options to view cutsites, orfs, translations ");
    cy.get(".tg-menu-bar")
      .contains("View")
      .click();
    cy.get(".bp3-menu")
      .contains("ORFs")
      .should("not.exist");
    cy.get(".bp3-menu")
      .contains("Amino Acid Numbers")
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

// Cypress.on("uncaught:exception", (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
// console.error(`err.stack:`,err.stack)
//   return false;
// });

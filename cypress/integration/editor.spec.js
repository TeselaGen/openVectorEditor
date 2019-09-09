describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });

  it(`should be able to hide the single import button if necessary!`, () => {
    cy.get(".tg-menu-bar")
      .contains("File")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Import Sequence")
      .should("exist");
    cy.tgToggle("hideSingleImport");
    cy.get(".tg-menu-bar")
      .contains("File")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Import Sequence")
      .should("not.exist");
  });

  it(`should be able to set visibilities!`, () => {
    cy.get(".ve-tool-container-cutsiteTool .bp3-active").should("exist");
    cy.get(".ve-tool-container-featureTool .bp3-active").should("exist");
    cy.get(".ve-tool-container-oligoTool .bp3-active").should("exist");
    cy.tgToggle("setDefaultVisibilities");
    cy.get(".ve-tool-container-cutsiteTool .bp3-active").should("not.exist");
    cy.get(".ve-tool-container-featureTool .bp3-active").should("not.exist");
    cy.get(".ve-tool-container-oligoTool .bp3-active").should("not.exist");
    //toggling the read only toggle should not affect any visibilities
    cy.tgToggle("readOnly");
    cy.get(".ve-tool-container-cutsiteTool .bp3-active").should("not.exist");
    cy.get(".ve-tool-container-featureTool .bp3-active").should("not.exist");
    cy.get(".ve-tool-container-oligoTool .bp3-active").should("not.exist");
  });
  it("can drag the editor", function() {
    cy.contains("No Selection");
    cy.dragBetween(`[data-row-number="0"]`, `[data-row-number="1"]`);
    cy.contains("No Selection").should("not.exist");
  });

  it(`should autosave if autosave=true`, function() {
    cy.tgToggle("shouldAutosave");

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
    cy.contains("onCopy callback triggered");
    cy.contains("onSave callback triggered");
    cy.contains("Selection Cut");
  });
  it(`should give the option to create from a subsection of the sequence if onCreateNewFromSubsequence is passed`, function() {
    cy.tgToggle("onCreateNewFromSubsequence");

    cy.get(".veLabelText")
      .contains("Part 0")
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").trigger("mouseover");
    cy.contains(".bp3-menu-item", "New Sequence From Selected Range").click();

    cy.contains("onCreateNewFromSubsequence callback triggered").should(
      "be.visible"
    );
  });
  it(`should handle rightClickOverrides correctly if they are passed`, function() {
    cy.tgToggle("overrideRightClickExample");

    cy.get(".veLabelText")
      .contains("Part 0")
      .trigger("contextmenu", { force: true });
    cy.get(".bp3-menu")
      .contains("My Part Override")
      .click();
    cy.contains("Part Override Hit!").should("be.visible");
  });
  it(`should handle clickOverrides correctly if they are passed`, function() {
    cy.tgToggle("clickOverridesExample");

    cy.get(".veLabelText")
      .contains("Part 0")
      .click({ force: true });

    cy.contains("Part Click Override Hit!").should("be.visible");
    //clicking the part SHOULD change the selection because in this demo the default part click is not
    cy.contains("div", "Selecting 21 bps from 11 to 31").should("be.visible");

    cy.get(".veLabelText")
      .contains("araC")
      .click({ force: true });

    cy.contains("Feature Click Override Hit!").should("be.visible");
    //clicking the feature SHOULD NOT change the selection because in this demo the default feature click is overridden
    cy.contains("div", "Selecting 21 bps from 11 to 31").should("be.visible");
  });
  it(`should handle propertiesListOverrides correctly if they are passed`, function() {
    cy.tgToggle("propertiesOverridesExample");

    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="parts"]`).click();
    cy.get(".ve-propertiesPanel")
      .contains("parts footer button")
      .click();

    cy.get(".bp3-toast")
      .contains("properties overrides successfull")
      .should("be.visible");
  });
  it(`should handle custom menu filters correctly`, () => {
    cy.tgToggle("menuOverrideExample");
    cy.get(".tg-menu-bar")
      .contains("Custom")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Copy")
      .click();
    cy.get(".bp3-toast").contains("No Sequence Selected To Copy");
    cy.get(".tg-menu-bar")
      .contains("File")
      .click();
    cy.get(".bp3-menu-item")
      .contains("Export Sequence")
      .trigger("mouseover");
    cy.contains(".bp3-menu-item", "Custom export option!").click({
      force: true
    });
    cy.get(".bp3-toast").contains("Custom export hit!");
  });
  it(`should handle custom dialog overrides correctly`, () => {
    cy.tgToggle("overrideAddEditFeatureDialog");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click();
    cy.contains("I Am Overridden. Any custom React can go here");
  });
  it(`should focus the linear view`, () => {
    cy.get(".veLinearView").should("not.be.visible");
    cy.contains("Focus Linear View").click();
    cy.get(".veLinearView").should("be.visible");
  });
  it(`should shuffle the tabs programatically`, () => {
    cy.get(".veLinearView").should("not.be.visible");
    cy.tgToggle("customizeTabs");
    cy.get(".veLinearView").should("be.visible");
    cy.get(".ve-draggable-tabs")
      .last()
      .contains("Sequence Map");
    cy.get(".ve-draggable-tabs")
      .last()
      .contains("New Alignment");
    cy.get(".ve-draggable-tabs")
      .last()
      .contains("Circular Map");
  });
  it(`should handle beforeSequenceInsertOrDelete hook correctly`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.contains(".veLabelText", "T0").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type("tta{enter}");
    cy.contains(".veLabelText", "CHANGED_SEQ");
  });
  it(`should handle beforeSequenceInsertOrDelete hook correctly while crossing the origin`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.contains(".veLabelText", "pS8c-vecto").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type("tta{enter}");
    cy.contains(".veLabelText", "CHANGED_SEQ");
    cy.contains("Selecting 3 bps from 1 to 3");
  });
  it(`should handle maintainOriginSplit flag correctly when pasted text is shorter than pre origin selection`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.tgToggle("maintainOriginSplit");
    cy.contains(".veLabelText", "pS8c-vecto").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type("tta{enter}");
    cy.contains(".veLabelText", "CHANGED_SEQ");
    cy.contains("Selecting 3 bps from 778 to 780");
  });
  it(`should handle maintainOriginSplit flag correctly when pasted text is longer than pre origin selection`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.tgToggle("maintainOriginSplit");
    cy.selectRange(5297, 3);

    cy.replaceSelection("ttaa");
    cy.contains(".veLabelText", "CHANGED_SEQ");
    cy.contains("Selecting 4 bps from 5295 to 1");
  });
});

import { inRange } from "lodash";

describe("editor", function () {
  beforeEach(() => {
    cy.visit("#/Editor?showCicularViewInternalLabels=false");
  });

  it(`annotation limits should persist across reloads and be configurable from the menu`, () => {
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(".veWarningMessage").should("not.exist");
    cy.get(`.tg-select-clear-all`).click();
    cy.get(".veWarningMessage").trigger("mouseover");
    cy.contains(
      "Warning: More than 100 Cut Sites. Only displaying 100 (Configure this under View > Limits)"
    );
    cy.contains(".tg-menu-bar-item", "View").click();
    cy.contains(".bp3-menu-item", "Limits").click();
    cy.contains(".bp3-menu-item", "Max Cut Sites To Show").click({
      force: true
    });
    cy.get(".bp3-menu-item:contains(100) .bp3-icon-small-tick");
    cy.get(".bp3-menu-item:contains(400)").click({ force: true });
    cy.get(".bp3-menu-item:contains(400) .bp3-icon-small-tick");
    cy.contains(
      "Warning: More than 400 Cut Sites. Only displaying 400 (Configure this under View > Limits)"
    );
    cy.get(".veTabLinearMap").click({ force: true });
    cy.get(".veWarningMessage").should("exist");
  });
  it(`annotation limits should not show up as options if maxAnnotationsToDisplay is passed`, () => {
    cy.get(".veWarningMessage").should("not.exist");
    cy.tgToggle("maxAnnotationsToDisplayAdjustment");
    cy.contains(".tg-menu-bar-item", "View").click();
    cy.contains(".bp3-menu-item", "Limits").should("not.exist");
    cy.get(".veWarningMessage").trigger("mouseover");
    cy.contains("Warning: More than 5 Features. Only displaying 5");
    cy.contains("(Configure this under View > Limits)").should("not.exist");
  });

  it(`should be able to hide the rotate circular view!`, () => {
    cy.get(`.veRotateCircularSlider`);
    cy.tgToggle(`withRotateCircularView`, false);
    cy.tgToggle(`withZoomCircularView`, false);
    cy.get(`.veRotateCircularSlider`).should("not.exist");
    cy.tgToggle(`withZoomCircularView`, true);
    cy.get(`.veRotateCircularSlider`).should("exist");
  });
  it(`should be able to hide the zoom circular view!`, () => {
    cy.get(`.veZoomCircularSlider`);
    cy.tgToggle(`withZoomCircularView`, false);
    cy.get(`.veZoomCircularSlider`).should("not.exist");
  });
  it(`should be able to hide the single import button if necessary!`, () => {
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Import Sequence").should("exist");
    cy.tgToggle("hideSingleImport");
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Import Sequence").should("not.exist");
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

  it("should fire the rename handler", function () {
    cy.get("body").type("{meta}/");
    cy.focused().type("rename{enter}");
    cy.focused().type("renamed seq");
    cy.contains(".bp3-dialog button", "OK").click();
    cy.contains("onRename callback triggered: pj5_00001renamed seq");
  });
  it("should fire the onSelectionOrCaretChanged handler", function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.tgToggle("onSelectionOrCaretChanged");

    cy.contains(".veLabelText", "Part 0").click();
    cy.contains(
      "onSelectionOrCaretChanged callback triggered caretPosition:-1 selectionLayer: start: 10 end: 30"
    );
    cy.get(".bp3-toast .bp3-icon-cross").click();
    cy.get("body").type("{meta}/").focused().type("select inverse{enter}");
    cy.contains(
      "onSelectionOrCaretChanged callback triggered caretPosition:-1 selectionLayer: start: 31 end: 9"
    );
    cy.get(".bp3-toast .bp3-icon-cross").click();
    cy.contains("button", "Select Inverse").click();
    cy.contains(
      "onSelectionOrCaretChanged callback triggered caretPosition:-1 selectionLayer: start: 10 end: 30 "
    );
  });
  it(`should allow you to view, but not edit features/parts/primers when in read only mode`, () => {
    cy.tgToggle("readOnly");
    cy.contains(".veRowViewPart", "Part 0").first().rightclick();
    cy.contains(".bp3-menu-item", "View Part Details").click();
    cy.contains(".bp3-dialog button", "Save").should("be.disabled");
  });
  it(`you should not be able to change editability of a sequence when disableSetReadOnly=true`, () => {
    cy.get(`.bp3-button:contains(File)`).click();
    cy.get(`[cmd="toggleReadOnlyMode"].bp3-disabled`).should("not.exist");
    cy.get(`.ve-tool-container-editTool.disabled`).should("not.exist");
    cy.tgToggle("disableSetReadOnly");
    cy.get(`.ve-tool-container-editTool.disabled`);
    cy.get(`.bp3-button:contains(File)`).click();
    cy.get(`[cmd="toggleReadOnlyMode"].bp3-disabled`);
  });

  it(`should allow you to view, but not edit the description when in read only mode`, () => {
    cy.contains("Properties").click();
    cy.contains(".tg-test-description", "Edit").should("exist");
    cy.tgToggle("readOnly");
    cy.contains(".tg-test-description", "Edit").should("not.exist");
    // cy.contains(".veRowViewPart", "Part 0").first().rightclick();
    // cy.contains(".bp3-menu-item", "View Part Details").click();
    // cy.contains(".bp3-dialog button", "Save").should("be.disabled");
  });

  it(`should autosave if autosave=true`, function () {
    //tnrnote: cut in cypress only works on electron, not firefox or chrome
    cy.tgToggle("shouldAutosave");
    cy.contains(".veRowViewPart", "Part 0").first().click();
    cy.get(".veRowViewSelectionLayer").first().trigger("contextmenu");
    cy.get(".bp3-menu-item").contains("Cut").click();
    cy.contains("onCopy callback triggered");
    cy.contains("onSave callback triggered");
    cy.contains("Selection Cut");
  });
  it(`should
  -trigger the onSaveAs callback if that handler is passed
  -allow saveAs when in read only mode `, function () {
    cy.tgToggle("onSaveAs");
    cy.selectRange(10, 20);
    cy.get(".veRowViewSelectionLayer").first().trigger("contextmenu");
    //tnrnote: cut in cypress only works on electron, not firefox or chrome

    cy.get(".bp3-menu-item").contains("Cut").click();
    cy.contains("Selection Cut");
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Save As").click();
    cy.contains("onSaveAs callback triggered");

    cy.tgToggle("readOnly");
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Save As").click();
    cy.contains("onSaveAs callback triggered");
  });
  it(`settings alwaysAllowSave=true should allow for saves to happen even when there are no file changes`, function () {
    cy.tgToggle("alwaysAllowSave");
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Save").click();
    cy.contains("onSave callback triggered");
  });
  it(`should give the option to create from a subsection of the sequence if onCreateNewFromSubsequence is passed`, function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.tgToggle("onCreateNewFromSubsequence");

    cy.contains(".veLabelText", "Part 0").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Create").trigger("mouseover");
    cy.contains(".bp3-menu-item", "New Sequence From Selected Range").click();

    cy.contains("onCreateNewFromSubsequence callback triggered").should(
      "be.visible"
    );
  });
  it(`should fire the beforeAnnotationCreate callback if one is passed`, function () {
    cy.tgToggle("beforeAnnotationCreate");
    cy.contains(".veLabelText", "Part 0").rightclick();
    cy.contains(".bp3-menu-item", "Create").trigger("mouseover");
    cy.contains(".bp3-menu-item", "New Primer").click();
    cy.focused().type("new primer");
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains("beforeAnnotationCreate callback triggered for primers");
  });
  it(`should handle rightClickOverrides correctly if they are passed`, function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.tgToggle("overrideRightClickExample");

    cy.contains(".veLabelText", "Part 0").trigger("contextmenu");
    cy.get(".bp3-menu").contains("My Part Override").click();
    cy.contains("Part Override Hit!").should("be.visible");
  });
  it(`should handle clickOverrides correctly if they are passed`, function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.tgToggle("clickOverridesExample");

    cy.contains(".veLabelText", "Part 0").click();

    cy.contains("Part Click Override Hit!").should("be.visible");
    //clicking the part SHOULD change the selection because in this demo the default part click is not
    cy.contains("div", "Selecting 21 bps from 11 to 31").should("be.visible");

    cy.get(".veLabelText").contains("araC").eq(0).click();

    cy.contains("Feature Click Override Hit!").should("be.visible");
    //clicking the feature SHOULD NOT change the selection because in this demo the default feature click is overridden
    cy.contains("div", "Selecting 21 bps from 11 to 31").should("be.visible");
  });
  it(`should handle propertiesListOverrides correctly if they are passed`, function () {
    cy.tgToggle("propertiesOverridesExample");

    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="parts"]`).click();
    cy.get(".ve-propertiesPanel").contains("parts footer button").click();

    cy.get(".bp3-toast")
      .contains("properties overrides successfull")
      .should("be.visible");
  });

  it(`should handle custom menu filters correctly`, () => {
    // if (Cypress.browser !== "")
    cy.tgToggle("menuOverrideExample");
    cy.get(".tg-menu-bar").contains("Custom").click();
    cy.get(".bp3-menu-item").contains("Copy").click();
    cy.get(".bp3-toast").contains("No Sequence Selected To Copy");
    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(".bp3-menu-item").contains("Export Sequence").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Custom export option!").click({
      force: true
    });
    cy.get(".bp3-toast").contains("Custom export hit!");
  });
  it(`should handle custom dialog overrides correctly`, () => {
    cy.tgToggle("overrideAddEditFeatureDialog");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click({ force: true });
    cy.contains("I Am Overridden. Any custom React can go here");
  });
  it(`should focus the linear view`, () => {
    cy.get(".veLinearView").should("not.exist");
    cy.contains("Focus Linear View").click();
    cy.get(".veLinearView").should("be.visible");
  });
  it(`should shuffle the tabs programatically`, () => {
    cy.get(".veLinearView").should("not.exist");
    cy.tgToggle("customizeTabs");
    cy.get(".veLinearView").should("be.visible");
    cy.get(".ve-draggable-tabs").last().contains("Sequence Map");
    cy.get(".ve-draggable-tabs").last().contains("New Alignment");
    cy.get(".ve-draggable-tabs").last().contains("Circular Map");
  });
  it(`should handle beforeSequenceInsertOrDelete hook correctly`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.contains(".veLabelText", "T0").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type("tta{enter}");
    cy.contains(".veLabelText", "CHANGED_SEQ");
  });
  it(`should handle beforeSequenceInsertOrDelete hook correctly while crossing the origin`, () => {
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.contains(".veLabelText", "pS8c-vecto").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Replace").click();

    cy.get(".sequenceInputBubble input").type("tta{enter}");
    cy.contains(".veLabelText", "CHANGED_SEQ");
    cy.contains("Selecting 3 bps from 1 to 3");
  });
  it(`should handle maintainOriginSplit flag correctly when pasted text is shorter than pre origin selection`, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.tgToggle("beforeSequenceInsertOrDelete");
    cy.tgToggle("maintainOriginSplit");
    cy.contains(".veLabelText", "pS8c-vecto").trigger("contextmenu");
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
  it(`should adjust font size of sequence name in circular view`, () => {
    cy.contains(".veCircularViewTextWrapper", "pj5_00001").then((text) => {
      const fontSize = parseInt(text[0].style.getPropertyValue("font-size"));
      expect(fontSize).to.equal(14);
    });
    cy.tgToggle("nameFontSizeCircularView");
    cy.contains(".veCircularViewTextWrapper", "pj5_00001").then((text) => {
      const fontSize = parseInt(text[0].style.getPropertyValue("font-size"));
      expect(fontSize).to.equal(10);
    });
  });
  it(`should handle enabling external labels and then only showing labels that don't fit`, () => {
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".tg-menu-bar-popover").contains("Labels").click();
    cy.get(".tg-menu-bar-popover")
      .contains("External Labels")
      .click({ force: true });
    cy.get(".veTabProperties").contains("Properties").click();
    cy.get(".veTabLinearMap").contains("Linear Map").click();
    cy.contains("text", "pSC101**");
    cy.contains("text", "pj5_00001");
    cy.get(`[data-test="onlyShowLabelsThatDoNotFit"]`).click({ force: true });
    cy.contains(".vePartLabel", "pj5_00001");
    cy.contains(".veFeatureLabel", "pSC101**");
  });
  it(`should handle adjusting label line intensity.`, () => {
    cy.get(".veLabelLine").should("have.css", "opacity", "0.1");
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".tg-menu-bar-popover").contains("Labels").click();
    cy.get(".tg-menu-bar-popover")
      .contains("Label Line Intensity")
      .click({ force: true });
    cy.get(".tg-menu-bar-popover").contains("High").click({ force: true });
    cy.get(".veLabelLine").should("have.css", "opacity", "0.9");
  });
  it(`should handle adjusting circular map label size.`, () => {
    cy.get(".veCircularViewLabelText").then((labelText) => {
      const fullFontSize = parseFloat(
        labelText[0].style.getPropertyValue("font-size").replace("px", "")
      );
      cy.get(".tg-menu-bar").contains("View").click();
      cy.get(".tg-menu-bar-popover").contains("Labels").click();
      cy.get(".tg-menu-bar-popover")
        .contains("Circular Label Size")
        .click({ force: true });
      cy.get(".tg-menu-bar-popover").contains("50%").click({ force: true });
      cy.get(".veCircularViewLabelText").then((fiftyPercentText) => {
        const halfFontSize = parseFloat(
          fiftyPercentText[0].style
            .getPropertyValue("font-size")
            .replace("px", "")
        );
        expect(
          inRange(
            halfFontSize,
            (fullFontSize / 2) * 0.9,
            (fullFontSize / 2) * 1.1
          )
        ).to.equal(true);
      });
    });
  });
  it(`should handle adjusting circular map label spacing.`, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.get(".veCircularViewLabelText")
      .contains("Example Primer 1")
      .then((preLabelText1) => {
        cy.get(".veCircularViewLabelText")
          .contains("araD")
          .then((preLabelText2) => {
            const preLabelTextDiff = Math.abs(
              parseFloat(preLabelText1[0].attributes.y.value) -
                parseFloat(preLabelText2[0].attributes.y.value)
            );
            cy.get(`[data-test="adjustCircularLabelSpacing"]`).click({
              force: true
            });
            cy.get(".veCircularViewLabelText")
              .contains("Example Primer 1")
              .then((postLabelText1) => {
                cy.get(".veCircularViewLabelText")
                  .contains("araD")
                  .then((postLabelText2) => {
                    const postLabelTextDiff = Math.abs(
                      parseFloat(postLabelText1[0].attributes.y.value) -
                        parseFloat(postLabelText2[0].attributes.y.value)
                    );
                    expect(preLabelTextDiff > postLabelTextDiff).to.equal(true);
                  });
              });
          });
      });
  });
  it(`should handle very long external labels in RowView`, () => {
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(".tg-menu-bar-popover").contains("Labels").click();
    cy.contains(".veLabelText", "Part 0").rightclick();
    cy.contains(".bp3-menu-item", "Edit Part").click();
    const longName =
      "long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name_long_name{enter}";
    cy.focused().type(longName, { passThru: true, timeout: 90000 });
    cy.contains(
      "Part 0long_name_long_name_long_name_long_name_long_name_long_name_long_nam.."
    );
  });
});

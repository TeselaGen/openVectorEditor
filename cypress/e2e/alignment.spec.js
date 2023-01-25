describe("alignment", function () {
  it("it should re-draw the labels of features/parts/primers when a feature is so long that the middle of the label does not fit into view", function () {
    cy.visit("#/Alignment");
    cy.get(".tg-alignment-visibility-toggle").click();
    cy.contains("cds feature").should("not.exist");
    cy.get(".bp3-popover .bp3-menu-item:contains(Features)").click();
    cy.contains("cds feature");
    cy.get(".tg-alignment-visibility-toggle").click();
    cy.contains("text", "long feat whose label should still appear").should(
      "be.visible"
    );
  });
  it("it should show an unmapped warning", function () {
    cy.visit("#/Alignment");
    cy.get(".bp3-icon-warning-sign");
  });

  it("allowTrimming should work properly", function () {
    cy.visit("#/Alignment");
    cy.get(`[data-tick-mark="20"]:first`).rightclick();
    cy.get(".tg-trimmed-region").should("not.exist");
    cy.contains("Ignore Before").should("not.exist");
    cy.tgToggle("allowTrimming");
    cy.get(`[data-tick-mark="20"]:first`).rightclick();
    cy.contains("Ignore Before").click();
    cy.get(".tg-trimmed-region").should("exist");
  });
  it("allowTrackRearrange should work properly", function () {
    cy.visit("#/Alignment");
    cy.get(".isDragDisabled").should("exist");
    cy.tgToggle("allowTrackRearrange");
    cy.get(".isDragDisabled").should("not.exist");
  });
  it("allowTrackNameEdit should work properly and shouldAutosave should work properly for alignments", function () {
    cy.visit("#/Alignment");
    cy.contains("F05206 lallasdfasldfalsdflasdf");
    cy.get(`.veAlignmentType:contains(Multiple Sequence Alignment)`);
    cy.get(".edit-track-name-btn").should("not.exist");
    cy.tgToggle("shouldAutosave");
    cy.tgToggle("allowTrackNameEdit");
    cy.get(".edit-track-name-btn:first").click();
    cy.focused().type("{selectall}asdfasdf{enter}");
    cy.contains("F05206 lallasdfasldfalsdflasdf").should("not.exist");
    cy.contains(".alignmentTrackNameDiv", "asdfasdf");
    cy.get(`.veAlignmentType:contains(Multiple Sequence Alignment)`);
    cy.contains("Autosave Triggered");
  });
  it("adding selection right click options should work", function () {
    cy.visit("#/Alignment");
    cy.tgToggle("addSelectionRightClickOptions");
    cy.selectAlignmentRange(10, 20);
    cy.get(".veAlignmentSelectionLayer:first").rightclick({ force: true });
    cy.contains(".bp3-menu-item", "I'm an additional option").click();
    cy.contains(".bp3-toast", "You did it");
  });
  it("overriding right click options should work", function () {
    cy.visit("#/Alignment");
    cy.tgToggle("overrideSelectionRightClick");
    cy.selectAlignmentRange(10, 20);
    cy.get(".veAlignmentSelectionLayer:first").rightclick({ force: true });
    cy.contains(".bp3-toast", "lezzz goooo!");
  });
  it("selection right click options should work and the additionalTopEl should be visible", function () {
    cy.visit("#/Alignment");
    cy.contains("Additional Top El");
    cy.selectAlignmentRange(10, 20);
    cy.get(".veAlignmentSelectionLayer:first").rightclick({ force: true });
    cy.contains(".bp3-menu-item", "Copy Selection of F05224 as Fasta");
    cy.contains(".bp3-menu-item", "Copy Selection of All Alignments ").click();
    cy.contains(".bp3-toast", "Selection Copied");
  });

  it("dragging in the alignment should only allow non-origin wrapping selections", function () {
    cy.visit("#/Alignment");
    cy.scrollAlignmentToPercent(0.0257);
    cy.contains(`[data-alignment-track-index="1"] text`, 100).click();
    cy.get("body").type("{shift}", { release: false });
    cy.contains(`[data-alignment-track-index="1"] text`, 110).click();
    cy.get(`[title="Selecting 10 bps from 101 to 110"]`);
    cy.get(`[title="Caret Between Bases 100 and 101"]`)
      .first()
      .then((el) => {
        cy.contains(`[data-alignment-track-index="1"] text`, 120)
          .first()
          .then((el2) => {
            cy.dragBetweenSimple(el, el2);
          });
      });
    cy.get(`[title="Selecting 11 bps from 111 to 121"]`);
    cy.get(`[title="Caret Between Bases 121 and 122"]`).then((el) => {
      cy.contains(`[data-alignment-track-index="1"] text`, 100)
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(`[title="Selecting 10 bps from 101 to 110"]`);
  });
  it("shift clicking in the alignment should only allow non-origin wrapping selections (no selection present)", function () {
    cy.visit("#/Alignment");
    cy.contains(`[data-alignment-track-index="1"] text`, 10).click();
    cy.get("body").type("{shift}", { release: false });
    cy.scrollAlignmentToPercent(0.99);
    cy.contains(`[data-alignment-track-index="1"] text`, 3510).click();
    cy.get(`[title="Selecting 3500 bps from 11 to 3510"]`);
  });
  it("the alignment should show axis numbers correctly", function () {
    cy.visit("#/Alignment?alignmentDataId=39");

    cy.scrollAlignmentToPercent(0.3);
    cy.contains(`[data-alignment-track-index="5"] .veAxis`, "290");
    cy.contains(`[data-alignment-track-index="5"] .veAxis`, "300");
    cy.contains(`[data-alignment-track-index="5"] .veAxis`, "310");
  });
  it("shift clicking in the alignment should only allow non-origin wrapping selections (with a selection already present)", function () {
    cy.visit("#/Alignment");
    // cy.tgToggle("isFullyZoomedOut");
    cy.get(`[data-alignment-track-index="1"]`);
    cy.selectAlignmentRange(56, 67);

    cy.get("body").type("{shift}", { release: false });
    cy.scrollAlignmentToPercent(0.99);
    cy.contains(`[data-alignment-track-index="1"] text`, 3510).click();
    cy.get(`[title="Selecting 3455 bps from 56 to 3510"]`);
  });
  it("scrolls the yellow scroll handle correctly", function () {
    cy.visit("#/Alignment");
    cy.contains("F05225").should("not.exist");
    cy.get(`[data-lane-index="13"]`).click();
    cy.contains("F05225").should("exist");
  });
  it("can turn on/off the axis with one click", function () {
    cy.visit("#/Alignment");
    cy.contains(".alignmentHolder .veRowViewAxis", 1);
    cy.get("button .bp3-icon-eye-open").click();

    cy.contains(".bp3-menu-item", "Axis").click();
    cy.contains(".alignmentHolder .veRowViewAxis", 1).should("not.exist");
  });

  it("can drag the alignment", function () {
    cy.visit("#/Alignment");
    //cy.get(".veAlignmentSelectionLayer").should("not.exist"); djr this class is used by other dom elements
    cy.get(`[title="Selecting 1001 bps from 997 to 1997"]`).should("not.exist");
    cy.tgToggle("isFullyZoomedOut");

    cy.contains("text", "1000").then((el) => {
      cy.contains("text", "2000")
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(`[title="Selecting 1001 bps from 997 to 1997"]`).should(
      "be.visible"
    );
  });
  /**
   * This verifies that clicking is disabled by clicking on the screen after toggle
   * and making sure a selection caret does not appear
   */
  it("can disable clicking and dragging within the alignment", function () {
    cy.visit("#/Alignment");
    cy.tgToggle("noClickDragHandlers");
    //cy.get(".veAlignmentSelectionLayer").should("not.exist"); this class is used by other elemnents in the dom
    cy.get(".selectionLayerCaret").should("not.be.visible");
    cy.tgToggle("isFullyZoomedOut");
    cy.contains("text", "1000").then((el) => {
      cy.contains("text", "2000")
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(".selectionLayerCaret").should("not.be.visible");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

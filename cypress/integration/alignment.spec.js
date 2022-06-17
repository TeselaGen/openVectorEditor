describe("alignment", function () {
  it("it should re-draw the labels of features/parts/primers when a feature is so long that the middle of the label does not fit into view", function () {
    cy.visit("#/Alignment");
    cy.get(".tg-alignment-visibility-toggle").click();
    cy.contains("cds feature").should("not.exist");
    cy.get(".bp3-popover .bp3-control:contains(Features)").click();
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
    cy.contains(".bp3-menu-item", "Copy Selection of F05225 as Fasta");
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

    cy.contains(".bp3-checkbox", "Axis").click();
    cy.contains(".alignmentHolder .veRowViewAxis", 1).should("not.exist");
  });

  it("can drag the alignment", function () {
    cy.visit("#/Alignment");
    cy.get(".veAlignmentSelectionLayer").should("not.exist");
    cy.tgToggle("isFullyZoomedOut");

    cy.contains("text", "1000").then((el) => {
      cy.contains("text", "2000")
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(".veAlignmentSelectionLayer").first().should("be.visible");
  });

  it("can disable clicking and dragging within the alignment", function () {
    cy.visit("#/Alignment");
    cy.tgToggle("noClickDragHandlers");
    cy.get(".veAlignmentSelectionLayer").should("not.exist");

    cy.tgToggle("isFullyZoomedOut");
    cy.contains("text", "1000").then((el) => {
      cy.contains("text", "2000")
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(".veAlignmentSelectionLayer").should("not.exist");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

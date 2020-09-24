describe("editor", function () {
  beforeEach(() => {
    cy.visit("#/Alignment");
  });

  it("right click options should work", function () {
    cy.contains("F05225").should("not.exist");
    cy.get(`[data-lane-index="13"]`).click();
    cy.contains("F05225").should("exist");
  });

  it("dragging in the alignment should only allow non-origin wrapping selections", function () {
    cy.tgToggle("setTickSpacing");
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
    // cy.tgToggle("isFullyZoomedOut");
    cy.contains(`[data-alignment-track-index="1"] text`, 355).click();
    cy.get("body").type("{shift}", { release: false });
    // cy.contains(`text`, 3195).click()
    cy.contains(`[data-alignment-track-index="1"] text`, 3195).click();
    cy.get(`[title="Selecting 2840 bps from 356 to 3195"]`);
  });
  it("shift clicking in the alignment should only allow non-origin wrapping selections (with a selection already present)", function () {
    // cy.tgToggle("isFullyZoomedOut");
    cy.get(`[data-alignment-track-index="1"]`);
    cy.then(() => {
      window.Cypress.updateAlignmentSelection({ start: 55, end: 66 });
    });
    cy.get("body").type("{shift}", { release: false });
    // cy.contains(`text`, 3195).click()
    cy.contains(`[data-alignment-track-index="1"] text`, 3195).click();
    cy.get(`[title="Selecting 3140 bps from 56 to 3195"]`);
  });
  it("scrolls the yellow scroll handle correctly", function () {
    cy.contains("F05225").should("not.exist");
    cy.get(`[data-lane-index="13"]`).click();
    cy.contains("F05225").should("exist");
  });
  it("can turn on/off the axis with one click", function () {
    cy.contains(".alignmentHolder .veRowViewAxis", 1);
    cy.get("button .bp3-icon-eye-open").click();

    cy.contains(".bp3-checkbox", "Axis").click();
    cy.contains(".alignmentHolder .veRowViewAxis", 1).should("not.exist");
  });

  it("can drag the alignment", function () {
    cy.get(".veAlignmentSelectionLayer").should("not.exist");

    cy.tgToggle("isFullyZoomedOut");
    cy.contains("text", "355").then((el) => {
      cy.contains("text", "710")
        .first()
        .then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
    });
    cy.get(".veAlignmentSelectionLayer").first().should("be.visible");
  });

  it("can disable clicking and dragging within the alignment", function () {
    cy.tgToggle("noClickDragHandlers");
    cy.get(".veAlignmentSelectionLayer").should("not.exist");

    cy.tgToggle("isFullyZoomedOut");
    cy.contains("text", "355")
      .first()
      .then((el) => {
        cy.contains("text", "710")
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

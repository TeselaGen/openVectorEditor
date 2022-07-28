describe("clickDragCaretAndSelectionLogic", function () {
  beforeEach(() => {
    cy.visit("#/Editor?showCicularViewInternalLabels=false");
  });
  // it("can drag the editor", function() {
  //   cy.contains("No Selection");
  //   cy.dragBetweenSimple(`[data-row-number="0"]`, `[data-row-number="1"]`);
  //   cy.contains("No Selection").should("not.exist");
  // });
  it(`should allow origin spanning drags if circular PART 2`, () => {
    cy.selectRange(13, 15);
    //drag between the cursor at 12 and the 150 tick mark:
    cy.get(`[title="Caret Between Bases 12 and 13"]`)
      .first()
      .then((el) => {
        cy.get(`[data-tick-mark="50"]`).then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
      });
    cy.get(`[title="Selecting 5265 bps from 50 to 15"]`);
    // cy.get(`[title="Selecting 5297 bps from 13 to 10"]`)
  });
  it(`should allow origin spanning drags if circular PART 1`, () => {
    cy.selectRange(13, 15);
    //drag between the cursor at 16 and the 10 tick mark:
    cy.get(`[title="Caret Between Bases 15 and 16"]`)
      .first()
      .then((el) => {
        cy.get(`[data-tick-mark="10"]`).then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
      });
    cy.get(`[title="Selecting 5296 bps from 13 to 9"]`);
  });
  it(`should not allow origin spanning drags if linear (row view drag)`, () => {
    cy.tgToggle("linear");
    cy.selectRange(13, 15);
    //drag between the cursor at 16 and the 10 tick mark:
    cy.get(`[title="Caret Between Bases 15 and 16"]`)
      .first()
      .then((el) => {
        cy.get(`[data-tick-mark="10"]`).then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
      });
    cy.get(`[title="Selecting 3 bps from 10 to 12"]`);
  });
  it(`should not allow origin spanning drags if linear (circular view drag)`, () => {
    cy.tgToggle("linear");

    cy.selectRange(13, 150);
    //drag between the cursor at 16 and the 10 tick mark:
    cy.get(`.vePolygonCaretHandle`)
      .first()
      .then((el) => {
        cy.contains(`text`, "4770").then((el2) => {
          cy.dragBetweenSimple(el, el2);
        });
      });
    cy.assertSelectionWithinRange({ min: 151, max: 4771, tolerance: 10 });
  });
  it(`should not allow origin spanning click if linear (circular view click with previous selection present)`, () => {
    cy.tgToggle("linear");
    cy.selectRange(13, 15);
    cy.get("body").type("{shift}", { release: false });
    cy.contains(`text`, "4770").click();
    cy.assertSelectionWithinRange({ min: 13, max: 4773, tolerance: 10 });
    cy.selectRange(4000, 4010);
    cy.get("body").type("{shift}", { release: false });
    cy.contains(`text`, "530").click();
    cy.assertSelectionWithinRange({ min: 520, max: 4010, tolerance: 10 });
  });

  it(`should handle dragging correctly`, () => {
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(100);
    cy.get(`[data-tick-mark="10"]`).then((el) => {
      cy.get(`[data-tick-mark="20"]`).then((el2) => {
        cy.dragBetweenSimple(el, el2);
      });
    });
    cy.wait(100);

    cy.get(`[title="Caret Between Bases 19 and 20"]`).then((el) => {
      cy.get(`[data-tick-mark="50"]`).then((el2) => {
        cy.dragBetweenSimple(el, el2);
      });
    });

    cy.contains("Selecting 40 bps from 10 to 49");
    cy.selectRange(4, 4);
    cy.wait(100);

    cy.get(`[data-tick-mark="50"]`).then((el) => {
      cy.get(`[data-tick-mark="60"]`).then((el2) => {
        cy.dragBetweenSimple(el, el2);
      });
    });
    cy.contains("Selecting 10 bps from 50 to 59");
    /* eslint-enable */
  });

  it(`shift clicking features should cause the selection layer to be augmented from 5' to 3'`, () => {
    //will select around the origin in 5' to 3' direction
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veCircularViewLabelText", "CmR").first().click();

    cy.get("body").type("{shift}", { release: false });
    cy.contains(".veCircularViewLabelText", "araD").first().click();
    cy.contains("Selecting 1671 bps from 4514 to 885");

    //will continue to select in 5' to 3' direction and not across origin
    cy.contains(".veCircularViewLabelText", "araD").first().click();
    cy.get("body").type("{shift}", { release: true });

    cy.get("body").type("{shift}", { release: false });
    cy.contains(".veCircularViewLabelText", "CmR").first().click();
    cy.assertSelectionWithinRange({ min: 7, max: 5173, tolerance: 10 });
    // cy.contains("Selecting 5167 bps from 7 to 5173");
  });
});

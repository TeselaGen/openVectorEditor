// import dragMock from 'drag-mock'

describe("tabs", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can open the new part window via hotkey and add a new part", function() {
    // cy.get('body').trigger('keydown', { keyCode: 114, which: 114 })
    cy.get("body").type("{meta}l");
    cy.contains("New Part");

    cy.focused()
      .clear()
      .type("newPart1");
    cy.get(`[label="Start:"]`)
      .clear()
      .type("10");
    cy.get(`[label="End:"]`)
      .clear()
      .type("20");
    cy.get(`[data-test="savePart"]`).click();
    cy.get(".veLabelText")
      .contains("newPart1")
      .click();
    cy.get(".veStatusBar").contains(`10 to 20`);
  });

  it("can switch between tabs", function() {
    cy.contains("Linear Map").click();
    cy.get(".veLinearView");
    cy.contains("Plasmid").click();
    cy.get(".veCircularView");
  });
  it.only("can drag tabs", function() {
    dragBetween(".veTabLinearMap", ".veTabProperties");
    cy.get(`[data-test="ve-draggable-tabs1"] .veTabLinearMap`);
    dragBetween(".veTabPlasmid", ".veTabProperties");
    cy.get("[data-test=ve-draggable-tabs0] .veTabLinearMap");
    cy.get("[data-test=ve-draggable-tabs1]").should('not.exist')
  });
});

function getCenter(el) {
  const b = el.getBoundingClientRect();
  const x = (b.right - b.left) / 2 + b.left;
  const y = (b.bottom - b.top) / 2 + b.top;
  return [x, y];
}
function dragBetween(dragSelector, dropSelector) {
  cy.clock();
  cy.get(dragSelector).then(el => {
    let dragSelectDomEl = el.get(0);
    cy.get(dropSelector).then(el2 => {
      let dropSelectDomEl = el2.get(0);
      const [x, y] = getCenter(dragSelectDomEl);
      const [xCenterDrop, yCenterDrop] = getCenter(dropSelectDomEl);
      cy.get(dragSelector)
        .trigger("mousedown", {
          button: 0,
          clientX: x,
          clientY: y
        })
        .tick(1000);
      // drag events test for button: 0 and also use the clientX and clientY values - the clientX and clientY values will be specific to your system
      cy.get(dragSelector)
        .trigger("mousemove", {
          button: 0,
          clientX: x + 10,
          clientY: y + 10
        }) // We perform a small move event of > 5 pixels this means we don't get dismissed by the sloppy click detection
        .tick(1000); // react-beautiful-dnd has a minimum 150ms timeout before starting a drag operation, so wait at least this long.

      cy.get("html") // now we perform drags on the whole screen, not just the draggable
        .trigger("mousemove", {
          button: 0,
          clientX: xCenterDrop,
          clientY: yCenterDrop
        })
        .tick(1000);
      cy.get("html")
        .trigger("mouseup", { // Causes the drop to be run
          button: 0,
          clientX: xCenterDrop,
          clientY: yCenterDrop
        })
        // .wait(200)
        // Can now test the application's post DROP state
    });
  });
}

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

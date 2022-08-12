describe("tabs", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`a custom tab should be able to be added`, () => {
    cy.tgToggle("customizeTabs");
    cy.get(".veTabMyCustomTab").click();
    cy.contains(".tg-editor-container", "Hello World, I am a Custom Tab");
    cy.contains(".tg-editor-container", "sequenceLength: 5299");
  });

  it("can open the new part window via hotkey and add a new part", function () {
    if (Cypress.browser.isHeadless) return true; //stop early because this test fails currently in headless mode
    // cy.get('body').trigger('keydown', { keyCode: 114, which: 114 })
    cy.get("body").type("{meta}l");
    cy.contains("New Part");

    cy.focused().clear().type("newPart1");
    cy.get(`[label="Start:"]`).clear().type("10");
    cy.get(`[label="End:"]`).clear().type("20");
    cy.get(`[data-test="savePart"]`).click();
    cy.get(".veLabelText").contains("newPart1").click();
    cy.get(".veStatusBar").contains(`10 to 20`);
  });

  it("can switch between tabs", function () {
    cy.contains("Linear Map").click();
    cy.get(".veLinearView");
    cy.contains("Circular Map").click();
    cy.get(".veCircularView");
  });
  it("can drag tabs", function () {
    cy.dragBetween(".veTabLinearMap", ".veTabProperties");
    cy.get(`[data-test="ve-draggable-tabs1"] .veTabLinearMap`, {
      force: true
    }).should("exist");
    cy.dragBetween(".veTabCircularMap", ".veTabProperties");
    cy.get("[data-test=ve-draggable-tabs0] .veTabLinearMap", {
      force: true
    }).should("exist");
    cy.get("[data-test=ve-draggable-tabs1]").should("not.exist");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

describe("menuBar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can use the select range tool", function() {
    // cy.
    cy.get('.tg-menu-bar').contains("Edit").click()
    cy.get('.tg-menu-bar-popover').contains("Select").click()
    cy.get(`[label="From:"]`).clear().type("10")
    cy.get(`[label="To:"]`).clear().type("20")
    cy.get(`.dialog-buttons`).contains("OK").click()
    cy.get(".veStatusBar").contains(`10 to 20`)
  });
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})



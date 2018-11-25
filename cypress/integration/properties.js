describe("properties", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it.only("can click into the orf properties tab and change the minimum orf size and trigger a warning in the editor", function() {
    cy.get(".veTabProperties").click()
    cy.get(`[data-tab-id="orfs"]`).click()
    cy.get(`[data-test="min-orf-size"]`).find("input").type("{selectall}30")
    cy.contains("Warning: More than")
  });
  it("can view the orf properties checkboxes even when the window height is small ", function() {
    cy.viewport(1000, 500)
    cy.get(".veTabProperties").click()
    cy.get(`[data-tab-id="orfs"]`).click()
    cy.contains("Use GTG and CTG").should('be.visible')
  });
  
});

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})



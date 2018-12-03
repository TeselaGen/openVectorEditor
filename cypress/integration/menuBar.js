describe("menuBar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  
  it('should be able to select a range (10 - 20) via Edit > Select and have the range correctly selected', function() {
      cy.get(".tg-menu-bar").contains("Edit").click()
      cy.get(".tg-menu-bar-popover").contains("Select").click()
      cy.get(`[label="From:"]`).clear().type("10")
      cy.get(`[label="To:"]`).clear().type("20")
      cy.get(".tg-min-width-dialog").contains("OK").click()
      cy.get(".veStatusBarItem").contains("10 to 20").should("be.visible")
  })


  it("menubar can be optionally displayed above or on the same line as the shortcuts", function() {
    cy.contains("showOptions").find("input").check({force: true})
    cy.contains("displayMenuBarAboveTools").find("input").check({force: true})
    cy.get(".veTools-displayMenuBarAboveTools").should("exist")
    cy.contains("displayMenuBarAboveTools").find("input").uncheck({force: true})
    cy.get(".veTools-displayMenuBarAboveTools").should("not.exist")
  });
  it("select range, copy, cut works", function() {
    cy.clock()
    cy.get('.tg-menu-bar').contains("Edit").click()
    cy.get('.tg-menu-bar-popover').contains("Select").click()
    cy.get(`[label="From:"]`).clear().type("10")
    cy.get(`[label="To:"]`).clear().type("20")
    cy.get(`.dialog-buttons`).contains("OK").click()
    cy.get(".veStatusBar").contains(`10 to 20`)

    cy.get(".veStatusBar").contains(`5299`)
    cy.get('.tg-menu-bar').contains("Edit").click().tick(200)
    cy.get('.tg-menu-bar-popover').contains("Copy").click()
    cy.contains("Selection Copied")
    cy.get('.tg-menu-bar').contains("Edit").click()
    cy.get('.tg-menu-bar-popover').contains("Cut").click()
    cy.contains("Selection Cut")
    cy.get(".veStatusBar").contains(`5288`)
  });
  // it("can use the select range tool", function() {
  //   // cy.
  //   cy.get('.tg-menu-bar').contains("Edit").click()
  //   cy.get('.tg-menu-bar-popover').contains("Select").click()
  //   cy.get(`[label="From:"]`).clear().type("10")
  //   cy.get(`[label="To:"]`).clear().type("20")
  //   cy.get(`.dialog-buttons`).contains("OK").click()
  //   cy.get(".veStatusBar").contains(`10 to 20`)
  // });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })



describe("properties", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can click into the orf properties tab and change the minimum orf size and trigger a warning in the editor", function() {
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
  it(`
  -can select all in the genbank properties window //todo
  -has a Part 0 in the genbank
  `
  , function() {
    cy.get(".veTabProperties").click()
    cy.get(`[data-tab-id="genbank"]`).click()
    //todo comment this in once select all is working with cypress 
    //cy.get(`[data-test="ve-genbank-text"]`).click().type("{meta}a")
    //Part 0 should be in there
    cy.get(`[data-test="ve-genbank-text"]`).contains("Part 0") 
    
  });
  // it.only('should ', function() {
  //   cy.visit("https://docs.cypress.io")
  //   cy.contains("What you’ll learn")
  //   cy.get("body").type("{meta}a")
  //   cy.contains("Our mission")
  // })
  // it.only('should ', function() {
  //   cy.visit("https://bulma.io/documentation/form/textarea/")
  //   // cy.contains("What you’ll learn")
  //   cy.get("textarea").first().type("thomas")
  //   cy.get("textarea").first().type("{meta}a")
  // })
  // it.only('should click try to login and fail', function() {
  //     cy.get(`input[name="email"]`).type("test@teselagen.com")
  //     cy.get(`input[name="password"]`).type("somepassword")
  //     cy.contains("Sign In").click()
  //     cy.contains("Login Unsuccessful: Incorrect email address or password.").should("exist")
  // })

  
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })



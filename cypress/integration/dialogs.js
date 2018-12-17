describe("dialogs", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it.only(`new feature dialog should 
  -not show a warning for a circular feature that fits within the sequence bounds if the sequence is circular

  `, ()=> {
    //open the new feature dialog
    cy.get(".tg-menu-bar").contains("Edit").click()
    cy.contains("New Feature").click()
    //change the start/end inputs to be making an origin spanning feature
    cy.get(".tg-test-name input").clear().type("Fake name")
    cy.get(".tg-test-start input").clear().type("400")
    cy.get(".tg-test-end input").clear().type("20")
    
    // verify that we can make that feature
    cy.get(".tg-upsert-feature").contains("Save").click()
    cy.get(".tg-test-end .bp3-intent-danger").should("not.exist")
    cy.get(".tg-test-start .bp3-intent-danger").should("not.exist")
    cy.get(".veLabelText").contains("Fake name").should("be.visible")
  })

  it(`part dialog should
  -handle notes add`, function() {
    // cy.contains("overrideToolbarOptions").find("input").check({force: true})
    // cy.get(`[data-test="veDownloadTool"]`).click()
    // cy.contains("Download tool hit!")
    // cy.get(`[data-test="my-overridden-tool-123"]`).click()
    // cy.contains("cha-ching")
    
  })
});

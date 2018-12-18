describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });
  
  it(`should autosave if autosave=true`, function() {
    cy.contains("shouldAutosave").find("input").check({force: true})
    cy.get(".veRowViewPart").contains("Part 0").first().click({force: true})
    cy.get(".veRowViewSelectionLayer").first().trigger('contextmenu', {force: true})
    cy.get(".bp3-menu-item").contains("Cut").click()
    cy.contains("onCopy callback triggered")
    cy.contains("onSave callback triggered")
    cy.contains("Selection Cut")
  })
  it(`should handle rightClickOverrides correctly if they are passed`, function() {
    cy.contains("Show custom right click").find("input").check({force: true})
    cy.get(".veLabelText").contains("Part 0").trigger('contextmenu', {force: true})
    cy.get(".bp3-menu").contains("My Part Override").click()
    cy.contains("Part Override hit!").should("be.visible")
  })

});

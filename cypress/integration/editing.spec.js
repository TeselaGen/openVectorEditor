describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });
  // it.only(`should handle focus correctly while editing`, ()=> {
  //   cy.selectRange(5297, 3);
  //   cy.deleteSelection();
  //   // cy.window()
  // })

  it(`should return focus correctly after typing in chars in circular view`, () => {
    cy.contains(".veCircularView text", "Part 0").click();
    cy.contains(".veCircularView text", "Part 0")
      .closest(".veVectorInteractionWrapper")
      .type("t");
    cy.focused().type("ttaaa{enter}");
    cy.contains("Selecting 5 bps from 11 to 15");
    cy.focused().type("t");
    cy.focused().type("ccccttaaa{enter}");
    cy.contains("Selecting 9 bps from 11 to 19");
    cy.focused().find(".veCircularView"); //the circular view should still be focused
  });
  it(`should return focus correctly after typing in chars in row view`, () => {
    cy.contains(".veRowView text", "Part 0")
      .click()
      .closest(".veVectorInteractionWrapper")
      .type("t");
    cy.focused().type("ttaaa{enter}");
    cy.contains("Selecting 5 bps from 11 to 15");
    cy.focused().type("t");
    cy.focused().type("ccccttaaa{enter}");
    cy.contains("Selecting 9 bps from 11 to 19");
    cy.focused().find(".veRowView"); //the row view should still be focused
  });
  it(`should be able to delete data around the origin correctly
  - the cursor should be place at the origin`, () => {
    cy.selectRange(5297, 3);
    cy.deleteSelection();
    cy.contains("Caret Between Bases 5293 and 1");
    cy.contains(".ve-row-item-sequence", /^gtcttatga/);
  });
  it(`should be able to insert data around the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.replaceSelection("aaaaaa");
    cy.contains("Selecting 6 bps from 1 to 6");
    cy.contains(".ve-row-item-sequence", /^aaaaaagtcttatga/);
    cy.selectRange(3, 5);
    cy.replaceSelection("tt");
    cy.contains("Selecting 2 bps from 3 to 4");
  });
  it(`should be able to revComp, comp selections that wrap the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.contains("Jump to start").click();
    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", /Complement Selection/).click();
    cy.contains(".ve-row-item-sequence", /^ctggtcttat/);

    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", "Reverse Complement Selection").click();

    cy.contains("Selecting 6 bps from 5297 to 3");
    cy.contains(".ve-row-item-sequence", /^ctagtcttatg/);
  });
  it("should be able to change the color of features by changing the feature type", () => {
    cy.contains(".veRowViewFeature", "araD").find(`path[fill="#006FEF"]`);
    cy.contains(".veLabelText", "araD").rightclick();
    cy.contains(".bp3-menu-item", "Edit Feature").click();
    cy.get(".tg-test-type input").click();
    cy.contains(".tg-select-option", "3'UTR").click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veRowViewFeature", "araD")
      .find(`path[fill="#006FEF"]`)
      .should("not.exist");
  });
});

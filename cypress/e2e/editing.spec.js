describe("editing", function () {
  beforeEach(() => {
    cy.visit("");
  });
  // it(`should handle focus correctly while editing`, ()=> {
  //   cy.selectRange(5297, 3);
  //   cy.deleteSelection();
  //   // cy.window()
  // })

  it(`editing a part/feature and saving shouldn't make the new part/feature window initialize in edit mode`, () => {
    cy.contains(".veRowView text", "Part 0").rightclick();
    cy.contains(`.bp3-menu-item`, "Edit Part").click();
    cy.contains(".bp3-dialog button", "Save").click();

    cy.contains(`button`, "Help").click();
    cy.focused().type("New Part{enter}");
    cy.contains(`.bp3-dialog`, "New Part");
    cy.get(`[placeholder="Untitled Annotation"]`);
  });

  it(`should return focus correctly after typing in chars in circular view`, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veCircularView text", "Part 0").click();
    cy.contains(".veCircularView text", "Part 0")
      .closest(".veVectorInteractionWrapper")
      .type("t", { passThru: true });
    cy.focused().type("ttaaa{enter}");
    cy.contains("Selecting 5 bps from 11 to 15");
    cy.focused().type("t", { passThru: true });
    cy.focused().type("ccccttaaa{enter}");
    cy.contains("Selecting 9 bps from 11 to 19");
    cy.focused().find(".veCircularView"); //the circular view should still be focused
  });
  it(`should return focus correctly after typing in chars in row view`, () => {
    cy.contains(".veRowView text", "Part 0")
      .click()
      .closest(".veVectorInteractionWrapper")
      .type("t", { passThru: true });
    cy.focused().type("ttaaa{enter}");
    cy.contains("Selecting 5 bps from 11 to 15");
    cy.focused().type("t", { passThru: true });
    cy.focused().type("ccccttaaa{enter}");
    cy.contains("Selecting 9 bps from 11 to 19");
    cy.focused().find(".veRowView"); //the row view should still be focused
  });
  it(`should be able to delete data around the origin correctly - the cursor should be placed at the origin`, () => {
    cy.selectRange(5297, 3);
    cy.get(`[title="Caret Between Bases 5296 and 5297"]`);
    cy.deleteSelection();
    cy.contains("Caret Between Bases 5293 and 1");
    cy.contains(".ve-row-item-sequence", "5'gtcttatga");
  });
  it(`should be able to insert data around the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.replaceSelection("aaaaaa");
    cy.contains("Selecting 6 bps from 1 to 6");
    cy.contains(".ve-row-item-sequence", "5'aaaaaagtcttatga");
    cy.selectRange(3, 5);
    cy.replaceSelection("tt");
    cy.contains("Selecting 2 bps from 3 to 4");
  });
  it(`should be able to revComp, comp selections that wrap the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.contains("Jump to start").click();
    cy.contains("button", "Jump to end").should("exist");
    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", /Complement Selection/).click();
    cy.contains(".ve-row-item-sequence", "5'ctggtcttat");

    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", "Reverse Complement Selection").click();

    cy.contains("Selecting 6 bps from 5297 to 3");
    cy.contains(".ve-row-item-sequence", "5'ctagtcttatg");
  });
  it("should be able to change the color of features by changing the feature type", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veRowViewFeature", "araD").find(`path[fill="#006FEF"]`);
    cy.contains(".veLabelText", "araD").rightclick({ force: true });
    cy.contains(".bp3-menu-item", "Edit Feature").click();
    cy.get(".tg-test-type input").click();
    cy.contains(".tg-select-option", "3'UTR").click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veRowViewFeature", "araD")
      .find(`path[fill="#006FEF"]`)
      .should("not.exist");
  });
  it("should be able to edit a feature/part via double clicking", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veRowViewPart", "Part 0").dblclick();
    cy.get(".tg-test-name input").should("have.value", "Part 0");
    cy.get(".bp3-dialog-close-button").click();
    cy.contains(".veRowViewFeature", "araD").find(`path[fill="#006FEF"]`);
    cy.contains(".veLabelText", "araD").dblclick({ force: true });
    cy.get(".tg-test-name input").should("have.value", "araD");
    cy.get(".bp3-dialog-close-button").click();
    cy.contains(".veLabelText", "Example Primer 1").dblclick();
    cy.get(".tg-test-name input").should("have.value", "Example Primer 1");
    cy.get(".bp3-dialog-close-button").click();
  });
  it("should be able to edit a feature/part start/end by clicking/dragging in the editor", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veRowViewPart", "Part 0").dblclick();
    cy.contains(
      "You can also click or drag in the editor to change the selection"
    ).dblclick();
    cy.get(".tg-test-start input").should("not.have.value", "4393");
    cy.contains(".veCircularViewLabelText", "T0").click();
    cy.get(".tg-test-start input").should("have.value", "4393");
    cy.get(".tg-test-end input").should("have.value", "4498");
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains("Selecting 106 bps from 4393 to 4498");
  });
});

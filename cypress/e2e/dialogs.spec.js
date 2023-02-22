describe("dialogs", function () {
  beforeEach(() => {
    cy.visit("");
  });

  it("editing notes should work", function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veLabelText", "araD").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Edit Feature").click({ force: true });
    cy.contains("Add Note").click();
    cy.contains(`[data-test="note-2"] .addAnnNoteKey`, "note");
    cy.get(`[data-test="note-2"] .addAnnNoteValue`).click();
    cy.focused().type("I'm a description");
    cy.get(`[data-test="note-0"] .bp3-icon-trash`).click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veLabelText", "araD").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Edit Feature").click({ force: true });
    cy.get(".addAnnNoteValue").should("have.length", 2);
    cy.contains(".addAnnNoteValue", "I'm a description");
  });
  it("adding notes on a new feature should save", function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veLabelText", "araD").rightclick({ force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click({ force: true });
    cy.focused().type("new feat");
    cy.screenshot();

    cy.contains("Add Note").click();
    cy.screenshot();

    cy.contains(`.addAnnNoteKey`, "note");
    cy.get(`.addAnnNoteValue`).click();
    cy.focused().type("I'm a description");

    cy.contains(".bp3-dialog button", "Save").click();
    cy.contains(".veLabelText", "new feat").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Edit Feature").click({ force: true });
    cy.get(".addAnnNoteValue").should("have.length", 1);
    cy.contains(".addAnnNoteValue", "I'm a description");
  });
  it("right click editing joined feature should work", function () {
    cy.contains(".veLabelText", "araC").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Edit Feature").click({ force: true });
    cy.get(".tg-test-locations-0-start input").should("have.value", "7");
    cy.get(".tg-test-locations-0-end input").should("have.value", "25");
    cy.get(".tg-test-locations-1-start input").should("have.value", "29");
    cy.get(".tg-test-locations-1-end input").should("have.value", "49");
  });
  it(`new feature dialog should not show a warning for a circular feature that fits within the sequence bounds if the sequence is circular`, () => {
    //open the new feature dialog
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.contains(".bp3-menu-item", "Create").click();
    //translation create should be disabled
    cy.contains(".bp3-menu-item.bp3-disabled", "New Translation").should(
      "exist"
    );
    cy.contains(
      ".bp3-menu-item.bp3-disabled",
      "New Reverse Translation"
    ).should("exist");
    cy.contains(".bp3-menu-item", "New Feature").click({ force: true });
    //change the start/end inputs to be making an origin spanning feature
    cy.get(".tg-test-name input").clear().type("Fake name");
    cy.get(".tg-test-start input").clear().type("400");
    cy.get(".tg-test-end input").clear().type("20");

    // verify that we can make that feature
    cy.get(".tg-upsert-annotation").contains("Save").click();
    cy.get(".tg-test-end .bp3-intent-danger").should("not.exist");
    cy.get(".tg-test-start .bp3-intent-danger").should("not.exist");
    cy.get(".veLabelText").contains("Fake name").should("be.visible");
  });
  it(`new part dialog should show a warning for a circular part that goes beyond the sequence and not show a warning for a circular part that fits within the sequence bounds if the sequence is circular`, () => {
    //open the new feature dialog
    cy.get(".tg-menu-bar").contains("Edit").click();

    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Part").click({ force: true });
    //change the start/end inputs to be making an origin spanning feature
    cy.get(".tg-test-name input").clear().type("Fake name");
    cy.get(".tg-test-start input").clear().type("400");
    cy.get(".tg-test-end input").clear().type("200000");

    // verify that we can't make an out of range part
    cy.get(".tg-upsert-annotation").contains("Save").click();
    cy.get(".tg-test-start .bp3-intent-danger").should("exist");

    // fix the range issue and verify that we can make that feature
    cy.get(".tg-test-end input").clear().type("20");
    cy.get(".tg-upsert-annotation").contains("Save").click();
    cy.get(".tg-test-end .bp3-intent-danger").should("not.exist");
    cy.get(".tg-test-start .bp3-intent-danger").should("not.exist");
    cy.get(".veLabelText").contains("Fake name").should("be.visible");
  });

  it(`part dialog should
  -handle changing strand direction
  -todo handle notes add`, function () {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    //open the edit part dialog by right clicking part 0
    cy.contains(".veLabelText", "Part 0").trigger("contextmenu", {
      force: true
    });
    cy.contains("Edit Part").click();
    //make an assertion that the part strand is currently negative
    cy.get(".tg-test-forward")
      .contains("Negative")
      .find("input")
      .should("be.checked");
    cy.get(".tg-test-forward")
      .contains("Positive")
      .find("input")
      .should("not.be.checked");
    // cy.get(`input[name="forward"]`).should("be.checked")

    //change the part strand from negative to positive
    cy.get(".tg-test-forward").contains("Positive").click();
    cy.get(".tg-upsert-annotation").contains("Save").click();

    //re-open the dialog and make sure the strand stays positive
    cy.contains(".veLabelText", "Part 0").trigger("contextmenu", {
      force: true
    });
    cy.contains("Edit Part").click();
    cy.get(".tg-test-forward")
      .contains("Negative")
      .find("input")
      .should("not.be.checked");
    cy.get(".tg-test-forward")
      .contains("Positive")
      .find("input")
      .should("be.checked");
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

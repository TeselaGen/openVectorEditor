describe("caretPositionOnDelete.spec", function () {
  it("the caret should stay at the end of the sequence when deleting (and not jump to the start)", function () {
    cy.visit("");
    cy.get(".veRowView");
    cy.selectRange(5299, 5299);
    cy.get(
      ".veVectorInteractionWrapper:contains(ccgatcaacgtctcattttcgccagatatc)"
    )
      .focus()
      .type(`{backspace}`);
    cy.contains("Caret Between Bases 5298 and 1");
    cy.contains("Jump to start");
    cy.contains("Jump to end").should("not.exist");
    cy.focused().type(`{backspace}`);
    cy.contains("Caret Between Bases 5297 and 1");
    cy.contains("Jump to start");
    cy.contains("Jump to end").should("not.exist");
  });
});

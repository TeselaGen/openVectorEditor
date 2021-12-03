describe("primers.spec", () => {
  it(`allowPrimerBasesToBeEdited=true should allow bases to be specified for a given primer`, function () {
    cy.visit("/#/Editor?allowPrimerBasesToBeEdited=true");
    cy.contains("text", "Example Primer 1").dblclick();
    cy.contains(`.tg-custom-sequence-editable`, "tgtgcgacgctggcgatatca");
    // cy.selectRange(30, 90);
    // cy.triggerFileCmd("New Primer");
  });
  it(`double clicking the primer you're already editing shouldn't cause ui issues`, function () {
    cy.visit("/#/Editor?allowPrimerBasesToBeEdited=true");
    cy.contains("text", "Example Primer 1").dblclick();
    cy.get('input[value="Example Primer 1"]');
    cy.contains(
      ".veRowViewPrimer text.veLabelText",
      "Example Primer 1"
    ).dblclick({ force: true });
    cy.get('input[value="Example Primer 1"]').should("exist"); //we used to allow re-open of the currently being edited dialog which would clear the initial values for some reason..
  });
});

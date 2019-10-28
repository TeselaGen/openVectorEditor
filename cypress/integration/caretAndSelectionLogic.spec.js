describe("caretAndSelectionLogic", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`shift clicking features should cause the selection layer to be augmented from 5' to 3'`, () => {
    //will select around the origin in 5' to 3' direction
    cy.contains(".veCircularViewLabelText", "CmR")
      .first()
      .click();

    cy.get("body").type("{shift}", { release: false });
    cy.contains(".veCircularViewLabelText", "araD")
      .first()
      .click();
    cy.contains("Selecting 1671 bps from 4514 to 885");

    //will continue to select in 5' to 3' direction and not across origin
    cy.contains(".veCircularViewLabelText", "araD")
      .first()
      .click();
    cy.get("body").type("{shift}", { release: true });

    cy.get("body").type("{shift}", { release: false });
    cy.contains(".veCircularViewLabelText", "CmR")
      .first()
      .click();
    cy.contains("Selecting 5167 bps from 7 to 5173");
  });
});

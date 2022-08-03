describe("pcrTool.spec", function () {
  it(`pcr tool should work`, () => {
    cy.visit(
      "/#/Editor?searchInput=&defaultLinkedOligoMessage=true&allowPrimerBasesToBeEdited=true&focusPCRTool=true"
    );
    cy.get(
      `.tg-test-forward-primer:contains(Example Primer 1):contains(60 - 83)`
    );
    cy.get(
      `.tg-test-reverse-primer:contains(Example Primer 2):contains(782 - 824)`
    );
    cy.contains("PCR Product from pj5_00001");
    cy.contains("782 bps");
    //clicking the primers in the pcr tool should jump to the correct position in the editor

    cy.get(`.tg-simple-dna-view .vePrimer:contains(Example Primer 1)`).click();
    cy.contains("Selecting 24 bps from 60 to 83");
    cy.get(`.tg-simple-dna-view .vePrimer:contains(Example Primer 2)`).click({
      shiftKey: true
    });
    cy.contains("Selecting 765 bps from 60 to 824");

    //removing a primer should clear the product
    cy.contains(
      `Please choose a forward and reverse primer to see the resulting PCR sequence`
    ).should("not.exist");
    cy.get(
      `.tg-test-forward-primer:contains(Example Primer 1) .bp3-icon-cross`
    ).click();
    cy.contains(
      `Please choose a forward and reverse primer to see the resulting PCR sequence`
    );
    cy.get(`.tg-test-forward-primer`).click();
    cy.get(`.bp3-menu-item:contains(Example Primer 3)`).click();
    cy.contains("5130 bps");
  });
});

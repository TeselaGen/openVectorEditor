describe("orfs", function () {
  it("the minimum orf size input should work as expected!", function () {
    cy.visit("");
    cy.contains(".tg-menu-bar button", "View").click();
    cy.contains(".bp3-menu-item:contains(7)", "ORFs").click();
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").should(
      "have.value",
      "300"
    );
    //negative numbers shouldn't be allowed and users should be able to select all!
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").type(
      "{selectall}-7000",
      { force: true }
    );
    cy.get(".bp3-menu-item:contains(Minimum ORF Size) input").should(
      "have.value",
      "7000"
    );
    //the number of orfs displayed should update in real time
    cy.contains(".bp3-menu-item:contains(0)", "ORFs");
  });

  it("'Use GTG And CTG As Start Codons' checkbox status should synchronize between toolbar and properties table", function () {
    cy.visit("");
    cy.contains(".tg-menu-bar button", "View").click();
    cy.contains(".bp3-menu-item:contains(7)", "ORFs").click();
    cy.get(
      ".bp3-menu-item:contains(Use GTG And CTG As Start Codons) .bp3-icon-blank"
    ).should("exist");
    cy.get(".bp3-menu-item:contains(Use GTG And CTG As Start Codons)").click({
      force: true
    });
    cy.get(
      ".bp3-menu-item:contains(Use GTG And CTG As Start Codons) .bp3-icon-small-tick"
    ).should("exist");
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.get(".propertiesVisFilter").click();
    cy.get(
      ".bp3-menu-item:contains(Use GTG And CTG As Start Codons) .bp3-icon-small-tick"
    ).should("exist");
  });

  it("ORFs should have Size AA equals (sequence size / 3 - 1)", function () {
    cy.visit("");
    cy.get(".veTabProperties").click();
    cy.get(`[data-tab-id="orfs"]`).click();
    cy.get(`[data-copy-text="260"]`).should("exist");
    cy.get(`[data-copy-text="783 (1236-2018)"]`).should("exist");
    cy.get(".propertiesVisFilter").click();
    cy.get(".bp3-menu-item:contains(ORFs):contains(7)").click({
      force: true
    });
    cy.get(".bp3-menu-item:contains(ORFs):contains(7)").click({
      force: true
    });
    cy.get(`[data-copy-text="260"]`).should("exist");
  });
});

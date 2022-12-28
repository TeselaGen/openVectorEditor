describe("chromatogram", function () {
  it("the chromatogram visibility toggle shouldn't show up unless chromatogramData is present", function () {
    cy.visit("");
    cy.triggerFileCmd("Chromatogram", { noEnter: true });
    cy.contains("No Results..");
    cy.tgToggle("chromatogramExample");
    cy.get(".chromatogram");
    cy.get(".chromatogram.noQualityScores").should("not.exist");
    cy.triggerFileCmd("Quality Scores");
    // Show Quality Scores options appears like a menu item to be clicked, so
    // the meta command {enter} doesnt cut it for this one, we need to click it.
    cy.contains("Show Quality Scores").click({ force: true });
    cy.get(".chromatogram.noQualityScores").should("exist");
  });

  it("editing while viewing a chromatogram doesn't break", function () {
    cy.visit("#/Editor?chromatogramExample=true");
    cy.get(".chromatogram");
    cy.selectRange(995, 998);
    //basically make sure the chromatogram gets bigger as more bases are inserted
    cy.get(`[data-row-number="9"] .chromatogram-trace-initialized canvas`)
      .invoke("width")
      .then((str) => {
        const w1 = parseInt(str);
        cy.log(w1);
        cy.replaceSelection("aaaaaa");
        cy.contains("Sequence Inserted Successfully");
        cy.get(".chromatogram");
        cy.log(w1);
        cy.get(`[data-row-number="9"] .chromatogram-trace-initialized canvas`)
          .invoke("width")
          .then((str) => {
            const w2 = parseInt(str);
            cy.log(w2).then(() => {
              assert.deepEqual(w2 > w1, true);
            });
          });
      });
  });
  it("right clicking a chromatogram should give the option to hide quality scores", function () {
    cy.visit("#/Editor?chromatogramExample=true");
    cy.get(".chromatogram").first().rightclick();
    cy.get(".chromatogram.noQualityScores").should("not.exist");
    cy.contains("Show Quality Scores").click({ force: true });
    cy.get(".chromatogram.noQualityScores").should("exist");
  });
});

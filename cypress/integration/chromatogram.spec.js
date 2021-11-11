describe("chromatogram", function () {
  it("the chromatogram visibility toggle shouldn't show up unless chromatogramData is present", function () {
    cy.visit("");
    cy.triggerFileCmd("Chromatogram", { noEnter: true });
    cy.contains("No Results..");
    cy.tgToggle("chromatogramExample");
    cy.get(".chromatogram");
    cy.get(".chromatogram.noQualityScores").should("not.exist");
    cy.triggerFileCmd("Chromatogram", { noEnter: true });
    cy.contains("Chromatogram").click();
    cy.contains("Show Quality Scores").click();
    cy.get(".chromatogram.noQualityScores").should("exist");
  });

  it("editing while viewing a chromatogram doesn't break", function () {
    cy.visit("#/Editor?chromatogramExample=true");
    cy.get(".chromatogram");
    cy.selectRange(995, 998);
    //basically make sure the chromatogram gets bigger as more bases are inserted
    cy.get(`[data-row-number="9"] .chromatogram-trace canvas`)
      .invoke("width")
      .then((str) => {
        const w1 = parseInt(str);
        cy.replaceSelection("aaaaaa");
        cy.contains("Sequence Inserted Successfully");
        cy.get(".chromatogram");
        cy.get(`[data-row-number="9"] .chromatogram-trace canvas`)
          .invoke("width")
          .then((str) => {
            const w2 = parseInt(str);
            assert.deepEqual(w2 > w1, true);
          });
      });
  });
  it("right clicking a chromatogram should give the option to hide quality scores", function () {
    cy.visit("#/Editor?chromatogramExample=true");
    cy.get(".chromatogram").first().rightclick();
    cy.get(".chromatogram.noQualityScores").should("not.exist");
    cy.contains("Show Quality Scores").click();
    cy.get(".chromatogram.noQualityScores").should("exist");
  });
});

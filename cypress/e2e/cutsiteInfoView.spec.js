describe("cutsiteInfoView", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`enzyme preview should be rendering cutsites correctly`, () => {
    cy.contains(".veLabelText", "AatII").dblclick();
    cy.get(`.bp3-dialog .snipPosition-12`);
  });

  it(`filtering for a hidden enzyme should bring up a 'These Hidden enzymes match' message`, () => {
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).type("AlwNI");
    cy.contains(`These Hidden enzymes match`);
    cy.contains("AlwNI (1 cut)").click();
    cy.contains("AlwNI (1 cut) hidden");

    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).type("esp3i");
    cy.contains(`These Hidden enzymes match`);
    cy.contains("Esp3I (2 cuts)").click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).should("not.exist"); //clicking the hidden enzyme should close the filter
    cy.contains("Esp3I (2 cuts) hidden");
    cy.get(
      `.bp3-dialog:contains(Aliases:):contains(BstGZ53I):contains(BstGZ53I)`
    );
    cy.get(`.bp3-dialog:contains(Aliases:) .bp3-tag:contains(BsmBI)`).click();
    cy.contains("BsmBI (2 cuts) inactive");
  });
  it(`filtering for an enzyme with 0 cuts should bring up a No Active Results.. These inactive enzymes match: message`, () => {
    cy.tgToggle("overrideManageEnzymes");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).type("bsai");
    cy.contains(`No Active Results.. These inactive enzymes match:`);
    cy.contains("BsaI (0 cuts)").click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).should("not.exist"); //clicking the hidden enzyme should close the filter
    cy.contains(".ve-enzymeSubrow", "ggtctc");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(`.veToolbarCutsiteFilterHolder input`).type("{selectAll}nocuts");
    cy.contains("noCutsEnzyme (0 cuts)").click();
    cy.contains(".ve-enzymeSubrow", "gggggggaaaaaaa");
    cy.contains(".bp3-dialog", "someGroup");
  });
  it(`clicking a cutsite or cutsite group should provide more info`, () => {
    cy.tgToggle("overrideManageEnzymes");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(".tg-select-toggle").click();
    cy.contains("someGroup").click();
    cy.contains(".bp3-tag", "someGroup").click();
    cy.contains("Compare..").click();
    cy.contains("vs Single cutters").click();
    cy.contains(`[data-test="tg-column-3"]`, "specialEnzyme2");
    cy.contains(`[data-test="tg-column-3"]`, "XmlI (1 cut)");
    cy.contains(`[data-test="tg-column-3"]`, "XmaI (1 cut)");
    cy.contains(`[data-test="tg-column-2"]`, "specialEnzyme1 (1 cut)");
    cy.contains(`[data-test="tg-column-1"]`, "bamhi (0 cuts)"); //tnr: should fix the name of the enzyme here
  });
  it(`clicking a cutsite should provide more info`, () => {
    cy.tgToggle("overrideManageEnzymes");
    cy.get(`[data-test="cutsiteToolDropdown"]`).click();
    cy.get(".tg-select-toggle").click();
    cy.contains(".tg-select-option", "specialEnzyme1").click();
    cy.contains(".bp3-tag", "specialEnzyme1").click();

    cy.contains(".rt-tr", "92").click();
    cy.contains("Caret Between Bases 92 and 93");

    cy.contains(".bp3-tag.bp3-intent-primary", "Single cutters");
    cy.contains(".bp3-tag.bp3-intent-primary", "someGroup").should("not.exist");
    cy.contains(".bp3-tag", "someGroup").click();

    cy.contains("someGroup (inactive)");
    cy.contains(".bp3-tag.bp3-intent-primary", "specialEnzyme1 (1 cut)");
  });
});

describe("find tool", function () {
  beforeEach(() => {
    cy.visit("");
  });

  it(`the find tool shouldn't get stuck in a weird state where the match number is greater than the number of matches`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gatg"); //this should cause 1 region to be selected
    cy.contains("1/2").should("not.exist");
    cy.contains("1/49");
    cy.get(`[data-test="veFindNextMatchButton"]`).click();
    cy.get(`[data-test="veFindNextMatchButton"]`).click();
    cy.contains("3/49");
    cy.deleteRange(281, 5298);
    cy.contains("3/3"); //the match number should stay at 3 if there are still at least 3 matches
    cy.deleteRange(241, 281);
    cy.contains("1/2"); //the match number should automatically return to 1 when the sequence changes and the number of matches change to be greater than the matchNumber
  });
  it(`when there is only 1 search result, typing enter in the find tool should jump you back to the search layer`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("tgacaacttgacggcta"); //this should cause 1 region to be selected
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("be.visible");
    cy.selectRange(400, 450);
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("not.exist");
    //hitting enter again should jump us back to our original search layer!
    cy.focused().type("{enter}");
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("be.visible");
  });
  it(`when there is only 2 search results but the search is palindromic, typing enter in the find tool should jump you back to the search layer`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gacgtc", { delay: 1 }); //this should cause 1 region to be selected
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("be.visible");
    cy.contains("dbl term").click({ force: true });
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("not.exist");
    //hitting enter again should jump us back to our original search layer!
    cy.get(`input[value="gacgtc"]`).type("{enter}");
    cy.get(".veRowViewSelectionLayer.veSearchLayerActive").should("be.visible");
  });
  it(`can be expanded and should have full functionality as such`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gataca", { delay: 1 }); //this should cause 1 region to be selected
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.contains(".ve-find-options-popover .bp3-switch", "Expanded").click();
    cy.get(".veFindBar textarea").should("have.value", "gataca");
    cy.focused().type("{enter}"); //this should cause the next region to be selected
    cy.contains("2/2");
  });
  it(`find parts/primers/features`, () => {
    cy.get(".ve-tool-container-featureTool").click();
    cy.get(".ve-tool-container-oligoTool").click();
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("araD"); //this should cause 1 region to be selected
    cy.contains(".veAnnotationFoundResult", "araD");
    cy.focused().clear().type("p"); //this should cause 1 region to be selected
    cy.contains(".veAnnotationFoundResult", "Operator I2").click();
    cy.contains(".veRowViewFeature", "Operator I2");
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.contains(".veAnnotationFoundResult", "Part 0").click();
    cy.contains(".veRowViewPart", "Part 0");
  });
  it(`have clickable find layers`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gattac"); //this should cause 1 region to be selected
    cy.get(".selectionLayerCaret polygon").should("not.be.visible"); //no polygon handle should exist on the search highlight layer
    cy.get(
      ".veSelectionLayer:not(.veSearchLayer):not(.cutsiteLabelSelectionLayer)"
    ).should("not.exist"); //no pure selection layer should exist
    cy.get(".veSearchLayer.veRowViewSelectionLayer")
      .should("be.visible")
      .click(); //click the search layer
    cy.get(".selectionLayerCaret polygon").should("be.visible"); //a selection layer should now exist
    cy.get(
      ".veSelectionLayer:not(.veSearchLayer):not(.cutsiteLabelSelectionLayer)"
    ).should("be.visible");
  });
  it(`reverse strand matches should cause annotations created from right click to be in reverse direction`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gagaga"); //this should cause 1 region to be selected
    cy.get(".veSearchLayer.veRowViewSelectionLayer")
      .should("be.visible")
      .rightclick(); //click the search layer
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click({ force: true });
    cy.contains(".bp3-radio", "Positive")
      .find("input")
      .should("not.be.checked");
    cy.contains(".bp3-radio", "Negative").find("input").should("be.checked");
  });
  it(`reverse strand matches should cause annotations created from click and then subsequent create to be in reverse direction`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gagaga"); //this should cause 1 region to be selected
    cy.get(".veSearchLayer.veRowViewSelectionLayer")
      .should("be.visible")
      .click(); //click the search layer
    cy.triggerFileCmd("New Primer");
    cy.contains(".bp3-radio", "Positive")
      .find("input")
      .should("not.be.checked");
    cy.contains(".bp3-radio", "Negative").find("input").should("be.checked");
  });
  it(`clear search layers when closed and retain the previous search and be selected when re-opened`, () => {
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.focused().type("gattac", { noPrevValue: true }); //this should cause 1 region to be selected
    cy.get(".veSearchLayerContainer").should("exist");
    cy.get(".veFindBar .bp3-icon-small-cross").click();
    cy.get(".veSearchLayerContainer").should("not.exist");
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.get(".veSearchLayerContainer").should("exist"); //test that the search didn't get cleared
    cy.focused().type("gattac", { noPrevValue: true }); //this should override the existing search because the existing search should already be highlighted
    cy.get(".veSearchLayerContainer").should("exist"); //asserts that there is at least 1 valid search found
  });

  it(`-it starts with nothing selected
  -it can find dna letters
  -it can toggle the find options and highlight all
  -and toggle finding Amino acids
  `, function () {
    cy.clock();
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    cy.tick(500);
    cy.get(".veFindBar").contains("0/0");
    cy.get(".veFindBar").contains("1/1").should("not.exist");
    cy.focused().type("gattac");
    cy.get(".veFindBar").contains("1/1");
    cy.focused().type("c");
    cy.get(".veFindBar").contains("0/0");
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.get(".ve-find-options-popover").contains("Highlight All").click();

    cy.get(".veFindBar input").clear().type("gat");
    cy.get(".selectionLayerCaret").should("have.length.greaterThan", 100);
    cy.get(`[data-test="veFindBarOptionsToggle"]`).click();
    cy.get(`.ve-find-options-popover [type="checkbox"]`).should("be.checked");
    cy.get(`[name="dnaOrAA"]`).select("Amino Acids");
    cy.get(".veFindBar").contains("1/2");
    cy.get(".veRowViewSelectionLayer").first().click({ force: true });
    cy.contains("372 to 380");

    cy.get(`[data-test="veFindNextMatchButton"]`).click();
    cy.get(".veRowViewSelectionLayer").first().click({ force: true });
    cy.contains("3999 to 4007");
  });

  //tnr: this doesn't work in cypress on linux rn
  it.skip(`cmd+f should open find tool if it is closed 
  cmd+f should refocus find tool if it is already open and unfocused
  cmd+f should do nothing if find tool is already open and focused
  esc should close the find tool if it is open and focused
  esc should do nothing if the find tool is open and not focused`, () => {
    cy.contains(`.veCircularViewMiddleOfVectorText`, "pj5_00001");
    cy.get(`[data-test="ve-find-tool-toggle"]`).click();
    // cy.get(".veVectorInteractionWrapper:first").type(`{cmd}f`); //for some reason this isn't working in cypress..
    cy.get(".tg-find-tool-input input").should("be.focused");
    cy.focused().type("gg").type(`{cmd}f`);
    cy.get(".tg-find-tool-input input").should("be.focused");
    cy.get(`[data-tick-mark="10"]`).then((el) => {
      cy.get(`[data-tick-mark="20"]`).then((el2) => {
        cy.dragBetweenSimple(el, el2);
      });
    });
    cy.get(".veVectorInteractionWrapper:first").type(`{cmd}f`);
    cy.focused().type("gg"); //focus and typing should still work immediately after a drag
    cy.get(`.veSearchLayer[title="Selecting 4 bps from 75 to 78"]`).click();
    cy.get(".veVectorInteractionWrapper:first").focus().type(`{esc}`);
    cy.get(`.veSearchLayer[title="Selecting 4 bps from 75 to 78"]`);
    cy.get(".tg-find-tool-input input").type(`{esc}`);
    cy.get(`.veSearchLayer[title="Selecting 4 bps from 75 to 78"]`).should(
      "not.exist"
    );
  });
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

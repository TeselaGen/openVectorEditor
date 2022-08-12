describe("menuBar", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`fivePrimeThreePrimeHints should be toggleable`, () => {
    cy.visit("");
    cy.get(`.tg-left-prime-direction:contains(5')`);
    cy.triggerFileCmd(`5' 3' Hints`);
    cy.get(`.tg-left-prime-direction:contains(5')`).should("not.exist");
  });
  it(`the menu should allow for custom toastr messages`, () => {
    cy.visit("");

    cy.contains("Trigger menu toastr message").click();
    cy.contains(".ove-menu-toast", "Sequence Saving");
    cy.contains(".ove-menu-toast", "Sequence Saved");
  });
  it("Should be able to hide individual features", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".tg-menu-bar button", "View").click();

    cy.contains(".veLabelText", "pSC101**");
    cy.contains(".veLabelText", "araD");
    cy.contains(".veLabelText", "araC");
    cy.contains(".bp3-menu-item", "Features").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Filter Individually")
      .contains("22/22")
      .trigger("mouseover", { force: true });
    cy.contains(".bp3-menu-item", "araD").click({ force: true });
    cy.contains(".bp3-menu-item", "araC").click({ force: true });

    cy.contains(".veLabelText", "araD").should("not.exist");
    cy.contains(".veLabelText", "araC").should("not.exist");
  });
  it("Should be able to hide individual parts", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".tg-menu-bar button", "View").click();

    cy.contains(".veLabelText", "Part 0");
    cy.contains(".veLabelText", "Curtis' Part");
    cy.contains(".bp3-menu-item", "Parts").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Filter Individually")
      .contains("3/3")
      .trigger("mouseover", { force: true });
    cy.contains(".bp3-menu-item", "Part 0").click({ force: true });
    cy.contains(".veLabelText", "Part 0").should("not.exist");
    cy.contains(".bp3-menu-item", "Uncheck All").click({ force: true });
    cy.contains(".veLabelText", "Curtis' Part").should("not.exist");
    cy.contains(".bp3-menu-item", "Check All").click({ force: true });
    cy.contains(".veLabelText", "Part 0");
    cy.contains(".veLabelText", "Curtis' Part");
  });
  it("Should be able to filter features by length", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".tg-menu-bar button", "View").click();
    cy.contains(".bp3-menu-item", "Features").trigger("mouseover");
    cy.get("[data-test=filter-feature-length]").click("top", { force: true });
    cy.contains(".veLabelText", "pSC101**").should("not.exist");
    cy.contains(".veLabelText", "araD").should("not.exist");
    cy.contains(".veLabelText", "araC").should("not.exist");
    cy.get('[data-test="max-feature-length"]').type("{selectall}900", {
      force: true
    });
    cy.contains(".veLabelText", "araD").should("exist");
    cy.contains(".veLabelText", "araC").should("exist");
    cy.get("[data-test=filter-feature-length]").click("top", { force: true });
    cy.contains(".veLabelText", "pSC101**").should("exist");
  });
  it("Should be able to filter part by length", () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".tg-menu-bar button", "View").click();
    cy.contains("Part - pj5_00001 - Start: 1 End: 5299");
    cy.contains(".bp3-menu-item", "Part").trigger("mouseover");
    cy.get("[data-test=filter-part-length]").click("top", { force: true });
    cy.contains("Part - pj5_00001 - Start: 1 End: 5299").should("not.exist");
    cy.get('[data-test="max-part-length"]').type("{selectall}6000", {
      force: true
    });
    cy.contains("Part - pj5_00001 - Start: 1 End: 5299");
  });
  it("Should be able to change circular/linear from the menu bar", () => {
    cy.contains(".tg-menu-bar button", "Edit").click();
    cy.contains(".bp3-menu-item", "Change Circular/Linear").trigger(
      "mouseover"
    );
    cy.get(":nth-child(2) > .bp3-menu-item").click({ force: true });
    cy.contains("Truncate Annotations").click();
    cy.contains(".tg-menu-bar button", "Edit").click();
    cy.contains(".bp3-menu-item", "Change Circular/Linear").trigger(
      "mouseover"
    );
    cy.get(
      ".bp3-menu > :nth-child(1) > .bp3-menu-item > .bp3-icon > svg"
    ).should("have.attr", "data-icon", "blank");
    cy.get(
      ".bp3-menu > :nth-child(2) > .bp3-menu-item > .bp3-icon > svg"
    ).should("have.attr", "data-icon", "small-tick");
  });
  it(`should be able to use the search/shortcut bar to translate the sequence`, () => {
    cy.get(".veRowViewTranslationsContainer")
      .first()
      .find("svg")
      .should("have.length", 1);
    cy.get("body").type("{meta}/");
    cy.focused().type("selec all{enter}");
    cy.get("body").type("{meta}/");
    cy.focused().type("new translation{enter}");
    cy.get(".veRowViewTranslationsContainer")
      .first()
      .find("svg")
      .should("have.length", 2);
  });
  it(`should be able to change the amino acid color (by hydrophobicity or by family)`, () => {
    cy.get(".tg-menu-bar").contains("View").click();
    cy.get(`.veRowViewTranslationsContainer .D[fill="hsl(268.9, 100%, 69%)"]`);
    cy.get(`.veRowViewTranslationsContainer .S[fill="hsl(298.6, 100%, 69%)"]`);
    cy.contains("Amino Acid Colors").click({ force: true });
    cy.contains("Color By Family").click({ force: true });
    cy.get(`.veRowViewTranslationsContainer .D[fill="#EE82EE"]`);
    cy.get(`.veRowViewTranslationsContainer .S[fill="#90EE90"]`);
    cy.contains("Color By Hydrophobicity").click({ force: true });
    cy.get(`.veRowViewTranslationsContainer .D[fill="hsl(268.9, 100%, 69%)"]`);
    cy.get(`.veRowViewTranslationsContainer .S[fill="hsl(298.6, 100%, 69%)"]`);
  });
  it(`should be able to permanently change sequence case`, () => {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.contains(".rowViewTextContainer", "gacgtcttatga");
    cy.contains(".bp3-menu-item", "Change Case").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Upper Case Sequence").click({ force: true });
    cy.contains(".rowViewTextContainer", "GACGTCTTATGA");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.contains(".bp3-menu-item", "Change Case").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Lower Case Sequence").click({ force: true });
    cy.contains(".rowViewTextContainer", "gacgtcttatga");
  });
  it(`should be able to permanently change selected sequence case`, () => {
    cy.contains(".veRowViewFeature", "araD").trigger("contextmenu", {
      force: true
    });
    cy.contains(".rowViewTextContainer", "gacgtcttatgacaacttgacgg");
    cy.contains(".bp3-menu-item", "Change Case").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Upper Case Selection").click();
    cy.contains(".rowViewTextContainer", "gacgtcTTATGACAACTTGACGG");
  });
  // it(`should be able toggle sequence case`, () => {
  //   cy.get(".tg-menu-bar")
  //     .contains("View")
  //     .click();
  //   cy.contains(".rowViewTextContainer", "gacgtcttatga");
  //   cy.contains(".bp3-menu-item", "Sequence Case").trigger("mouseover");
  //   cy.contains(".bp3-menu-item", "Upper").click();
  //   cy.contains(".rowViewTextContainer", "GACGTCTTATGA");
  //   cy.contains(".bp3-menu-item", "Upper").click();
  //   cy.contains(".rowViewTextContainer", "gacgtcttatga");
  // });

  it(`should be able to filter by feature`, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.get(".tg-menu-bar").contains("View").click();
    cy.contains(".bp3-menu-item", "Features").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Filter By Type")
      .contains("9/9")
      .trigger("mouseover", { force: true });
    cy.contains(".veLabelText", "araD");
    cy.contains(".veLabelText", "araC");
    cy.contains(".bp3-menu-item", "misc_feature").click({ force: true });
    cy.contains(".veLabelText", "araD").should("not.exist");
    cy.contains(".bp3-menu-item", "Filter By Type").contains("8/9");
    cy.contains(".bp3-menu-item", "Uncheck All").click({ force: true });
    cy.contains(".bp3-menu-item", "Filter By Type").contains("0/9");
    cy.contains(".veLabelText", "araC").should("not.exist");
    cy.contains(".bp3-menu-item", "Check All").click({ force: true });
    cy.contains(".veLabelText", "araC").should("exist");
  });
  it(`should be able to open the hotkeys dialog`, () => {
    cy.get("body").type("{meta}/");
    cy.focused().type("hotkeys{enter}");
    cy.contains(".bp3-dialog", "Editor Hotkeys");
    cy.focused().type("{esc}", { force: true });
    cy.contains(".bp3-dialog", "Editor Hotkeys").should("not.exist");
  });
  it(`should be able to remove duplicate features`, () => {
    cy.get(`[data-test="cutsiteHideShowTool"]`).click();
    cy.contains(".veLabelText", "araD").should("exist");
    cy.get("body").type("{meta}/");
    cy.focused().type("remove duplicate feature{enter}", { delay: 1 });
    cy.contains(".rt-td", "dbl term").should("exist");
    cy.contains(".bp3-dialog button", "Remove 2 Duplicates");
    cy.get(".bp3-dialog .bp3-icon-settings").click();
    cy.get(".tg-test-ignore-name .tg-no-fill-field").click();
    cy.get(".tg-test-ignore-strand .tg-no-fill-field").click();
    cy.get(".tg-test-ignore-start-and-end .tg-no-fill-field").click();
    cy.contains(".bp3-dialog button", "Remove 21 Duplicates").click();
    cy.contains(".veLabelText", "araD").should("not.exist");
  });

  it("should not be able to select a range in a length 0 sequence", function () {
    function shouldBeDisabled(text) {
      cy.contains(".bp3-menu-item", text).closest(".bp3-disabled");
    }
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select All").click();

    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Cut").click();
    cy.get(".tg-menu-bar").contains("Edit").click({ force: true });

    [
      "Find...",
      "Cut",
      "Copy",
      "Go To",
      "Select...",
      "Select All",
      "Select Inverse",
      "Complement Selection",
      "Reverse Complement Selection",
      "Rotate To Caret Position",
      // "New Feature",
      // "New Part",
      "Complement Entire Sequence"
    ].forEach(shouldBeDisabled);
    // cy.get(`[label="From:"]`)
    //   .clear()
    //   .type("10");
    // cy.get(`[label="To:"]`)
    //   .clear()
    //   .type("20");
    // cy.get(".tg-min-width-dialog")
    //   .contains("OK")
    //   .click();
    // cy.get(".veStatusBarItem")
    //   .contains("10 to 20")
    //   .should("be.visible");
  });
  it("should have the select range tool initialized correctly", function () {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select").click();
    cy.get(`.tg-test-from input`).should("have.value", "1");
    cy.get(`.tg-test-to input`).should("have.value", "1");
    cy.contains("Selecting 1 bp from 1 to 1").should("exist");
  });
  it(`select range should be initialized from a previous selection or caret pos correctly`, function () {
    cy.contains(".veRowViewPart", "Part 0").click({ force: true });
    cy.contains(".veStatusBarItem", "11 to 31");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select").click();
    cy.get(`[label="From:"]`)
      .should("have.value", "11")
      .clear()
      .type("10", { noPrevValue: true });
    cy.get(`[label="To:"]`)
      .should("have.value", "31")
      .clear()
      .type("20", { noPrevValue: true });
    cy.get(".tg-min-width-dialog").contains("Select 11 BPs").click();
    cy.contains(".veStatusBarItem", "10 to 20").should("be.visible");
  });
  it("should be able to select a range (10 - 20) via Edit > Select and have the range correctly selected", function () {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select").click();
    cy.get(`[label="From:"]`).clear().type("10", { noPrevValue: true });
    cy.get(`[label="To:"]`).clear().type("20", { noPrevValue: true });
    cy.get(".tg-min-width-dialog").contains("Select 11 BPs").click();
    cy.get(".veStatusBarItem").contains("10 to 20").should("be.visible");
  });

  it(`save tool should be disabled initially and then enabled after an edit is made`, () => {
    cy.contains(".tg-menu-bar button", "File").click();
    cy.get(`[cmd="saveSequence"]`).should("have.class", "bp3-disabled");

    cy.selectRange(2, 5);
    cy.get(".tg-menu-bar").contains("Edit").trigger("mouseover");
    cy.get(".tg-menu-bar-popover").contains("Cut").click();

    cy.get(".tg-menu-bar").contains("File").click();
    cy.get(`[cmd="saveSequence"]`).should("not.have.class", "bp3-disabled");
  });

  it("menubar can be optionally displayed above or on the same line as the shortcuts", function () {
    cy.tgToggle("showDemoOptions");
    cy.tgToggle("displayMenuBarAboveTools");

    cy.get(".veTools-displayMenuBarAboveTools").should("exist");
    cy.tgToggle("displayMenuBarAboveTools", false);

    cy.get(".veTools-displayMenuBarAboveTools").should("not.exist");
  });
  it(` goTo, rotateTo work
  -can't go to a position outside of the sequence
  -can go to a position inside the sequence 
  -can rotate the sequence to that position
  `, () => {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Go To").click();
    cy.focused().clear().type("0", { noPrevValue: true });
    cy.get(".bp3-dialog").contains("OK").should("be.enabled");
    cy.focused().clear().type("5299", { noPrevValue: true });
    cy.get(".bp3-dialog").contains("OK").should("be.enabled");
    cy.focused().clear().type("2000000", { noPrevValue: true });
    cy.get(".bp3-dialog").contains("OK").should("be.disabled");
    cy.focused().clear().type("20", { noPrevValue: true });
    cy.get(".bp3-dialog").contains("OK").click();
    cy.contains("Caret Between Bases 20 and 21");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Rotate To Caret Position").click();
    cy.contains("Caret Between Bases 5299 and 1");
  });

  it(`you can go to a position or a range and then directly type in bps
  `, () => {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Go To").click();
    cy.focused().clear().type("10", { noPrevValue: true });
    cy.get(".bp3-dialog").contains("OK").click();
    cy.focused().type("a", { passThru: true });
    cy.contains(".sequenceInputBubble", "Press ENTER to insert");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select").click();
    cy.get(`[label="From:"]`).clear().type("10", { noPrevValue: true });
    cy.get(`[label="To:"]`).clear().type("20", { noPrevValue: true });
    cy.get(`.dialog-buttons`).contains("Select 11 BPs").click();
    cy.focused().type("a", { passThru: true });

    cy.contains(".sequenceInputBubble", "Press ENTER to replace");
  });
  it(`
  select range, copy, cut works
    -cannot select range outside of sequence //TODO
    -can select a valid range 
    -can copy the select bps
    -can cut the selected bps
  `, function () {
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Select").click();
    cy.get(`[label="From:"]`).clear().type("10", { noPrevValue: true });

    cy.get(`[label="To:"]`).clear();
    cy.get(`.dialog-buttons`).contains("Select 0 BPs").should("be.disabled");
    cy.get(`[label="To:"]`).clear().type("20000000", { noPrevValue: true });
    cy.get(`.dialog-buttons`).contains("Select 0 BPs").should("be.disabled");

    cy.get(`[label="To:"]`).clear().type("20", { noPrevValue: true });
    cy.get(`.dialog-buttons`).contains("Select 11 BPs").click();
    cy.get(".veStatusBar").contains(`10 to 20`);

    cy.get(".veStatusBar").contains(`5299`);
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Copy").click();
    cy.contains("Selection Copied");
    cy.get(".tg-menu-bar").contains("Edit").click();
    cy.get(".tg-menu-bar-popover").contains("Cut").click();
    cy.contains("Selection Cut");
    cy.get(".veStatusBar").contains(`5288`);
  });
  // it("can use the select range tool", function() {
  //   // cy.
  //   cy.get('.tg-menu-bar').contains("Edit").click()
  //   cy.get('.tg-menu-bar-popover').contains("Select").click()
  //   cy.get(`[label="From:"]`).clear().type("10", { noPrevValue: true })
  //   cy.get(`[label="To:"]`).clear().type("20", { noPrevValue: true })
  //   cy.get(`.dialog-buttons`).contains("OK").click()
  //   cy.get(".veStatusBar").contains(`10 to 20`)
  // });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })

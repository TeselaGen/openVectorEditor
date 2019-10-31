describe("menuBar", function() {
  beforeEach(() => {
    cy.visit("");
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
  it(`should be able permanently change sequence case`, () => {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.contains(".rowViewTextContainer", "gacgtcttatga");
    cy.contains(".bp3-menu-item", "Change Case").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Upper Case Sequence").click();
    cy.contains(".rowViewTextContainer", "GACGTCTTATGA");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.contains(".bp3-menu-item", "Change Case").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Lower Case Sequence").click();
    cy.contains(".rowViewTextContainer", "gacgtcttatga");
  });
  it(`should be able permanently change selected sequence case`, () => {
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
    cy.get(".tg-menu-bar")
      .contains("View")
      .click();
    cy.contains(".bp3-menu-item", "Feature Types")
      .contains("9/9")
      .trigger("mouseover");
    cy.contains(".veLabelText", "araD");
    cy.contains(".veLabelText", "araC");
    cy.contains(".bp3-menu-item", "misc_feature").click();
    cy.contains(".veLabelText", "araD").should("not.exist");
    cy.contains(".bp3-menu-item", "Feature Types").contains("8/9");
    cy.contains(".bp3-menu-item", "Uncheck All").click();
    cy.contains(".bp3-menu-item", "Feature Types").contains("0/9");
    cy.contains(".veLabelText", "araC").should("not.exist");
    cy.contains(".bp3-menu-item", "Check All").click({ force: true });
    cy.contains(".veLabelText", "araC").should("exist");
  });
  it(`should be able to open the hotkeys dialog`, () => {
    cy.get("body").type("{meta}/");
    cy.focused().type("hotkeys{enter}");
    cy.contains(".bp3-dialog", "Editor Hotkeys");
    cy.focused().type("{esc}");
    cy.contains(".bp3-dialog", "Editor Hotkeys").should("not.exist");
  });
  it(`should be able to remove duplicate features`, () => {
    cy.get("body").type("{meta}/");
    cy.focused().type("remove duplicate feature{enter}");
    cy.get(".bp3-dialog .bp3-icon-settings").click();
    cy.contains("araD").should("exist");
    cy.contains(".bp3-dialog button", "Remove 3 Duplicates");
    cy.get(".tg-test-ignore-name .tg-no-fill-field").click();
    cy.get(".tg-test-ignore-strand .tg-no-fill-field").click();
    cy.get(".tg-test-ignore-start-and-end .tg-no-fill-field").click();
    cy.contains(".bp3-dialog button", "Remove 21 Duplicates").click();
    cy.contains("araD").should("not.exist");
  });

  it("should not be able to select a range in a length 0 sequence", function() {
    function shouldBeDisabled(text) {
      cy.contains(".bp3-menu-item", text).closest(".bp3-disabled");
    }
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select All")
      .click();

    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Cut")
      .click();
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click({ force: true });

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
  it("should have the select range tool initialized correctly", function() {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`.tg-test-from input`).should("have.value", "1");
    cy.get(`.tg-test-to input`).should("have.value", "1");
    cy.contains("Selecting 1 bp from 1 to 1").should("exist");
  });
  it(`select range should be initialized from a previous selection or caret pos correctly`, function() {
    cy.contains(".veRowViewPart", "Part 0").click({ force: true });
    cy.contains(".veStatusBarItem", "11 to 31");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`[label="From:"]`)
      .should("have.value", "11")
      .clear()
      .type("10");
    cy.get(`[label="To:"]`)
      .should("have.value", "31")
      .clear()
      .type("20");
    cy.get(".tg-min-width-dialog")
      .contains("Select 11 BPs")
      .click();
    cy.contains(".veStatusBarItem", "10 to 20").should("be.visible");
  });
  it("should be able to select a range (10 - 20) via Edit > Select and have the range correctly selected", function() {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`[label="From:"]`)
      .clear()
      .type("10");
    cy.get(`[label="To:"]`)
      .clear()
      .type("20");
    cy.get(".tg-min-width-dialog")
      .contains("Select 11 BPs")
      .click();
    cy.get(".veStatusBarItem")
      .contains("10 to 20")
      .should("be.visible");
  });

  it(`save tool should be disabled initially and then enabled after an edit is made`, () => {
    cy.contains(".tg-menu-bar button", "File").click();
    cy.get(`[cmd="saveSequence"]`).should("have.class", "bp3-disabled");

    cy.selectRange(2, 5);
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .trigger("mouseover");
    cy.get(".tg-menu-bar-popover")
      .contains("Cut")
      .click();

    cy.get(".tg-menu-bar")
      .contains("File")
      .click();
    cy.get(`[cmd="saveSequence"]`).should("not.have.class", "bp3-disabled");
  });

  it("menubar can be optionally displayed above or on the same line as the shortcuts", function() {
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
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Go To")
      .click();
    cy.focused()
      .clear()
      .type("0");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.enabled");
    cy.focused()
      .clear()
      .type("5299");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.enabled");
    cy.focused()
      .clear()
      .type("2000000");
    cy.get(".bp3-dialog")
      .contains("OK")
      .should("be.disabled");
    cy.focused()
      .clear()
      .type("20");
    cy.get(".bp3-dialog")
      .contains("OK")
      .click();
    cy.contains("Caret Between Bases 20 and 21");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Rotate To Caret Position")
      .click();
    cy.contains("Caret Between Bases 5299 and 1");
  });

  it(`you can go to a position or a range and then directly type in bps
  `, () => {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Go To")
      .click();
    cy.focused()
      .clear()
      .type("10");
    cy.get(".bp3-dialog")
      .contains("OK")
      .click();
    cy.focused().type("a");
    cy.contains(".sequenceInputBubble", "Press ENTER to insert");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`[label="From:"]`)
      .clear()
      .type("10");
    cy.get(`[label="To:"]`)
      .clear()
      .type("20");
    cy.get(`.dialog-buttons`)
      .contains("Select 11 BPs")
      .click();
    cy.focused().type("a");

    cy.contains(".sequenceInputBubble", "Press ENTER to replace");
  });
  it(`
  select range, copy, cut works
    -cannot select range outside of sequence //TODO
    -can select a valid range 
    -can copy the select bps
    -can cut the selected bps
  `, function() {
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Select")
      .click();
    cy.get(`[label="From:"]`)
      .clear()
      .type("10");

    cy.get(`[label="To:"]`).clear();
    cy.get(`.dialog-buttons`)
      .contains("Select 0 BPs")
      .should("be.disabled");
    cy.get(`[label="To:"]`)
      .clear()
      .type("20000000");
    cy.get(`.dialog-buttons`)
      .contains("Select 0 BPs")
      .should("be.disabled");

    cy.get(`[label="To:"]`)
      .clear()
      .type("20");
    cy.get(`.dialog-buttons`)
      .contains("Select 11 BPs")
      .click();
    cy.get(".veStatusBar").contains(`10 to 20`);

    cy.get(".veStatusBar").contains(`5299`);
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Copy")
      .click();
    cy.contains("Selection Copied");
    cy.get(".tg-menu-bar")
      .contains("Edit")
      .click();
    cy.get(".tg-menu-bar-popover")
      .contains("Cut")
      .click();
    cy.contains("Selection Cut");
    cy.get(".veStatusBar").contains(`5288`);
  });
  // it("can use the select range tool", function() {
  //   // cy.
  //   cy.get('.tg-menu-bar').contains("Edit").click()
  //   cy.get('.tg-menu-bar-popover').contains("Select").click()
  //   cy.get(`[label="From:"]`).clear().type("10")
  //   cy.get(`[label="To:"]`).clear().type("20")
  //   cy.get(`.dialog-buttons`).contains("OK").click()
  //   cy.get(".veStatusBar").contains(`10 to 20`)
  // });
});

// Cypress.on('uncaught:exception', (err, runnable) => {
//   // returning false here prevents Cypress from
//   // failing the test
//   return false
// })

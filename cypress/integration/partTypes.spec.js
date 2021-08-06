describe("partTypes", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`parts that overlap with themselves should be supported`, () => {
    cy.hideCutsites();
    cy.tgToggle("allowPartsToOverlapSelf");
    cy.contains("I wrap myself - Start: 88 (wraps full sequence) End: 94");
    cy.contains(".veCircularViewLabelText", "I wrap myself").dblclick();
    cy.contains("Length: 5306");
    cy.contains(".bp3-dialog div", "Overlaps Self").click();
    cy.contains(".bp3-dialog button", "Save").click();
    cy.get(".veRowViewPart.overlapsSelf").should("not.exist");
    cy.get(".veCircularViewPart.overlapsSelf").should("not.exist");

    cy.contains(".veLabelText", "Part 0").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Edit Part").click();
    cy.contains(".bp3-dialog div", "Advanced").click();
    cy.contains(".bp3-dialog div", "Overlaps Self").click();
    cy.contains(".bp3-dialog button", "Save").click();

    cy.get(".veRowViewPart.overlapsSelf").should("exist");
    cy.get(".veCircularViewPart.overlapsSelf").should("exist");
    cy.contains(".veLabelText", "Part 0").trigger("contextmenu");
    cy.contains(".bp3-menu-item", "Edit Part").click();
    //this should already be open!
    cy.contains(".bp3-dialog div", "Overlaps Self");
  });

  it(`should be able to add a part type`, () => {
    cy.get(".veRowViewSelectionLayer").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Part").click();
    cy.get(".tg-test-type").click();
    cy.contains(".tg-select-option", "misc_RNA").click();
    cy.get(".tg-test-name input").type("test part");
    cy.get(".tg-test-end input").type("0");

    cy.get(".bp3-dialog-body").contains("Save").click();
    cy.contains(".veRowViewPart text", "test part").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Edit Part").click();
    cy.get(".bp3-dialog-body").contains(".tg-select", "misc_RNA");
  });

  it("should be able to make a part from feature", () => {
    cy.get(".veRowViewSelectionLayer").trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Create").click();
    cy.contains(".bp3-menu-item", "New Feature").click();
    cy.get(".tg-test-name input").type("test feature");
    cy.get(".tg-test-end input").type("0");
    cy.get(".tg-select").click();
    cy.contains(".tg-select-option", "misc_RNA").click();
    cy.get(".bp3-dialog-body").contains("Save").click();
    cy.contains(".veRowViewFeaturesContainer text", "test feature").trigger(
      "contextmenu",
      { force: true }
    );
    cy.contains(".bp3-menu-item", "Make a Part from Feature").click();
    cy.get(".bp3-menu").should("not.exist");
    cy.contains(".veRowViewPart title", "test feature").trigger("contextmenu", {
      force: true
    });
    cy.contains(".bp3-menu-item", "Edit Part", { timeout: 15000 }).click();
    cy.get(".bp3-dialog-body").contains(".tg-select", "misc_RNA");
  });
});

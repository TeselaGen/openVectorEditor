describe("autoAnnotate", function () {
  beforeEach(() => {
    cy.visit("#Editor");
  });
  it(`the auto-annotate tools should show up if their respective handlers are shown`, () => {
    cy.triggerFileCmd("Auto Annotate", { noEnter: true });
    cy.contains("Auto Annotate").should("not.exist");
    cy.tgToggle("passAutoAnnotateHandlers");
    cy.triggerFileCmd("Auto Annotate", { noEnter: true });
    cy.contains("Auto Annotate").should("exist");
    cy.contains("Auto Annotate Features").click();
    cy.contains("auto annotate features callback triggered");
  });
});

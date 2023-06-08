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
  it(`the auto annotation addon custom list should work`, () => {
    cy.tgToggle("withAutoAnnotateAddon");
    cy.tgToggle("withGetCustomAutoAnnotateList");
    cy.hideCutsites();
    cy.hideParts();
    cy.removeFeatures();
    cy.triggerFileCmd("Auto Annotate Parts");
    // cy.contains("Loading...").should("exist");
    cy.contains("Loading...").should("not.exist");
    cy.contains("My Parts").should("not.exist");
    cy.closeDialog();

    cy.triggerFileCmd("Auto Annotate Features");
    cy.contains("My Features").click();
    cy.contains(".bp3-dialog button", "Annotate").click();
    cy.contains(
      `Detected that Row 1 (I cover the full Seq) has a non-standard type of`
    );
    cy.contains("button", "OK").click();
    cy.contains("1 Selected");
    cy.contains('.rt-tr:contains("I cover the full")', "5299");
    cy.contains("button", "Add").click();
    cy.contains(
      `Feature (misc_feature) - I cover the full Seq - Start: 1 End: 5299`
    );
  });
  it(`the auto annotation ape upload addon should work`, () => {
    cy.tgToggle("withAutoAnnotateAddon");
    cy.hideCutsites();
    cy.hideParts();
    cy.removeFeatures();
    cy.triggerFileCmd("Auto Annotate Features");
    cy.contains("ApE File").click();
    cy.uploadFile(`.bp3-dialog .tg-dropzone`, "Default_Features.txt");
    cy.contains(".bp3-dialog button", "Annotate").click();
    cy.contains(
      `Detected that Row 5 (SP6) has a non-standard type of primer_zoink. We will assign it and all subsequent non-standard types to use the misc_feature type instead`
    );
    cy.contains("button", "OK").click();
    cy.contains("19 Selected");
    cy.contains("button", "Add").click();
    cy.contains(`T7 - Start: 217 End: 335`);
  });
  it(`auto annotating parts should work when the csv file has a 'type' column `, () => {
    cy.tgToggle("withAutoAnnotateAddon");
    cy.hideCutsites();
    cy.hideParts();
    cy.removeFeatures();
    cy.triggerFileCmd("Auto Annotate Parts");
    cy.uploadFile(
      `.bp3-dialog .tg-dropzone`,
      "csvAnnotationList.csv",
      "text/csv"
    );
    cy.contains(`csvAnnotationList.csv`);
    cy.contains(".bp3-dialog button", "Annotate").click();
    cy.contains("11 Selected");
    cy.contains("button", "Add").click();
    cy.contains(`Part - Example Feature 1 - Start: 74 End: 102`);
  });
  it(`auto annotating parts should work when the csv file doesn't have a 'type' column `, () => {
    cy.tgToggle("withAutoAnnotateAddon");
    cy.hideCutsites();
    cy.hideParts();
    cy.removeFeatures();
    cy.triggerFileCmd("Auto Annotate Parts");
    cy.uploadFile(
      `.bp3-dialog .tg-dropzone`,
      "csvAnnotationList_no_type.csv",
      "text/csv"
    );

    cy.contains(".bp3-dialog button", "Annotate").click();
    cy.contains("10 Selected");

    cy.contains("button", "Add").click();
    cy.contains(`Part - Example Feature 1 - Start: 74 End: 102`);
  });
  it(`the auto annotation csv upload addon should work`, () => {
    cy.tgToggle("withAutoAnnotateAddon");
    cy.hideCutsites();
    cy.hideParts();
    cy.removeFeatures();
    cy.triggerFileCmd("Auto Annotate Features");

    cy.uploadFile(
      `.bp3-dialog .tg-dropzone`,
      "csvAnnotationList.csv",
      "text/csv"
    );
    cy.contains(`csvAnnotationList.csv`);
    cy.contains(".bp3-dialog button", "Annotate").click();
    cy.contains("11 Selected");
    cy.get(`.rt-tr:contains(Example Feature 1)`).click();
    cy.get(`.rt-tr:contains(Example Feature 2)`);
    cy.get(`.rt-tr:contains(amino acid Feat):contains(protein)`);
    cy.get(`.rt-tr:contains(Example Feature 3):contains(1)`);
    cy.get(`.rt-tr:contains(Reverse Feature):contains(-1)`);

    cy.contains("button", "Add").click();
    cy.contains(".veCircularViewLabelText", "Example Feature 2");
    cy.contains("Feature (CDS) - Example Feature 2 - Start: 135 End: 165");

    cy.contains(".veCircularViewLabelText", "Example Feature 1").should(
      "not.exist"
    );
    cy.get(`.veFeature:contains(Reverse Feature - Start: 1577 End: 2801)`); //it should be orange
    // cy.get(
    //   `.veFeature:contains(Reverse Feature - Start: 1577 End: 2801) path[fill="#EF6500"]`
    // ); //it should be orange
    cy.contains(".veCircularViewLabelText", "Example Feature 3").dblclick();
    cy.get(`.bp3-radio input[name="forward"][value="true"]`);
    cy.get(`.tg-select-value:contains(primer_bind)`);
  });
});

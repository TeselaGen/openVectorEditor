describe("toolbar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it(`find tool should be working as expected
  -it starts with nothing selected
  -it can find dna letters
  -it can toggle the find options and highlight all
  -and toggle finding Amino acids
  `, function() {
    cy.clock()
      cy.get(`[data-test="ve-find-tool-toggle"]`).click()
      cy.tick(500)
      cy.get(".veFindBar").contains("0/0")
      cy.get(".veFindBar").contains("1/1").should("not.exist")
      cy.focused().type("gattac")
      cy.get(".veFindBar").contains("1/1")
      cy.focused().type("c")
      cy.get(".veFindBar").contains("0/0")
      cy.get(`[data-test="veFindBarOptionsToggle"]`).click()
      cy.get(".ve-find-options-popover").contains("Highlight All").click()
      
      cy.get(".veFindBar input").clear().type("gat")
      cy.get(".selectionLayerCaret").should("have.length.greaterThan", 100)
      cy.get(`[data-test="veFindBarOptionsToggle"]`).click()
      cy.get(`.ve-find-options-popover [type="checkbox"]`).should("be.checked")
      cy.get(`[name="dnaOrAA"]`).select("Amino Acids")
      cy.get(".veFindBar").contains("1/2")
      cy.get(".veRowViewSelectionLayer").first().click({force: true})
      cy.contains("372 to 380")

      cy.get(`[data-test="veFindNextMatchButton"]`).click()
      cy.get(".veRowViewSelectionLayer").first().click({force: true})
      cy.contains("3999 to 4007")

  })

  it('should be able to have individual tool functionality overridden', function() {
    cy.get(`[data-test="overrideToolbarOptions"]`).check({force: true})
    cy.get(`[data-test="veDownloadTool"]`).click()
    cy.contains("Download tool hit!")
    cy.get(`[data-test="my-overridden-tool-123"]`).click()
    cy.contains("cha-ching")
    
  })
  it("import tool should be able to import a genbank file", function() {
    cy.uploadFile(`[data-test="veImportTool"]`, "pj5_00002.gb");
    cy.contains("Sequence Imported").should("exist");
    cy.contains("Parsed using Genbank Parser").should("exist");
  });
  it("cutsite tool should toggle on and off cutsites", function() {
    cy.get(`.cutsiteLabelSelectionLayer`).should("exist")
    cy.get(`.veCutsite`).should("exist")
    cy.get(`.veRowViewCutsite.snip`).should("exist")
    cy.get(`.veRowViewCutsite.snipConnector`).should("exist")
    cy.get(`[data-test="cutsiteHideShowTool"]`).click()
    cy.get(`.cutsiteLabelSelectionLayer`).should("not.exist")
    cy.get(`.veCutsite`).should("not.exist")
    cy.get(`.veRowViewCutsite.snip`).should("not.exist")
    cy.get(`.veRowViewCutsite.snipConnector`).should("not.exist")
    cy.get(`[data-test="cutsiteHideShowTool"]`).click()
    cy.get(`.cutsiteLabelSelectionLayer`).should("exist")
    cy.get(`.veCutsite`).should("exist")
    cy.get(`.veRowViewCutsite.snip`).should("exist")
    cy.get(`.veRowViewCutsite.snipConnector`).should("exist")
  });
  it("export tool should be able to export a genbank, fasta, or tg file", function() {
    if (Cypress.browser.isHeadless) return true //stop early because this test fails currently in headless mode
    cy.clock();
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download Genbank File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download FASTA File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");
    cy.get(`[data-test="veDownloadTool"]`).click();
    cy.contains("Download Teselagen JSON File").click();
    cy.contains("File Downloaded Successfully");
    cy.tick(30000); //pass some time so that the toastr isn't shown
    cy.contains("File Downloaded Successfully").should("not.exist");

    // cy.contains("Sequence Imported").should("exist")
    // cy.contains("Parsed using Genbank Parser").should("exist")
  });

  it("can open the cutsite dropdown and add an additional enzyme", function() {
    cy.get("[data-test=cutsiteToolDropdown]").click();
    cy.contains("Single cutters");
    cy.get(".Select-control").click();
    cy.get(".Select-control").click();
    cy.contains("Add additional enzymes").click();
    cy.contains("Select cut sites").click(); //click twice because of react dropdown weirdness
    cy.contains("Select cut sites").click();
    cy.contains("AanI").click();
    cy.contains("Cuts 2 times").click();
    cy.contains("Add Enzyme").click();
    cy.get(".ve-toolbar-dropdown").contains("Cuts 2 times");
  });

  it("you should be able to undo and redo the deletion of several features", function() {
    cy.get(`[data-test="veUndoTool"]`).click()
    cy.contains("Undo Successful").should("not.exist")
    cy.get(".veCircularViewLabelText")
      .contains("CAP site")
      .click();
    cy.contains("Selecting 14 bps from 1115 to 1128");
    cy.get(".veVectorInteractionWrapper").first().type("{backspace}");
    cy.contains("Sequence Deleted Successfully")
    cy.get(`[data-test="veUndoTool"]`).click()
    cy.contains("Undo Successful")
  });

  // it("can switch between tabs", function() {
  //   cy.contains("Linear Map").click();
  //   cy.get(".veLinearView");
  //   cy.contains("Plasmid").click();
  //   cy.get(".veCircularView");
  // });

  // it can save
  // it('File > New Sequence', function() {
  //   cy.get("[data-test=jumpToEndButton]").click()
  //   cy.get("[data-test=jumpToStartButton]").click()
  // })
  //   Vector Editor: File > New Sequence
  // Vector Editor: File > Save
  // Vector Editor: File > Save As
  // Vector Editor: File > Open a Sequence File
  // Vector Editor: File > Export to File > GENBANK
  // Vector Editor: File > Export to Fiile > FASTA
  // Vector Editor: File > Export to File > SBOL XML/RDF
  // Vector Editor: File > Export to File > Include Parts (Genbank Only)
  // Vector Editor: File > Print Sequence
  // Vector Editor: File > Print Circular View
  // Vector Editor: File > Print Linear View
  // Vector Editor: File > Properties > General (check all fields)
  // Vector Editor: File > Properties > Feature (create and edit features)
  // Vector Editor: File > Properties > Parts (check all functionality)
  // Vector Editor: File > Properties > CutSites (check all functionality)
  // Vector Editor: File > Properties > ORFs (check all functionality)
  // Vector Editor: File > Properties > Genbank (check all functionality)
  // Vector Editor: Edit > Cut
  // Vector Editor: Edit > Copy
  // Vector Editor: Edit > Copy Options
  // Vector Editor: Edit > Paste
  // Vector Editor: Edit > Undo
  // Vector Editor: Edit > Redo
  // Vector Editor: Edit > Find
  // Vector Editor: Edit > Go to
  // Vector Editor: Edit > Select
  // Vector Editor: Edit > Select All
  // Vector Editor: Edit > Select Inverse
  // Vector Editor: Edit > Reverse Complement Selection
  // Vector Editor: Edit > Reverse Complement Entire Sequence
  // Vector Editor: Edit > Rotate to Caret Postion
  // Vector Editor: Edit > New Feature
  // Vector Editor: Edit > New Part
  // Vector Editor: View > Circular
  // Vector Editor: View > Linear
  // Vector Editor: View > Map Caret
  // Vector Editor: View > Features
  // Vector Editor: View > Cut Sites
  // Vector Editor: View> ORFs
  // Vector Editor: View > Complementary
  // Vector Editor: View > Spaces
  // Vector Editor: View > Sequence AA
  // Vector Editor: View > Revcom AA
  // Vector Editor: View > Feature Lables
  // Vector Editor: View > Part Lables
  // Vector Editor: View > Cut Site Lables
  // Vector Editor: View > Zoom In
  // Vector Editor: View > Zoom Out
  // Vector Editor: Tools > Restriction Enzyme Manager
  // Vector Editor: Tools > Simulate Digestion
  // Vector Editor: Menu Bar: Floppy Disk Icon
  // Vector Editor: Menu Bar: Print Icon
  // Vector Editor: Menu Bar: UP Arrow Icon
  // Vector Editor: Menu Bar: Piece of Pie Feature Icon
  // Vector Editor: Menu Bar: Piece of Pie Part Icon
  // Vector Editor: Menu Bar: Undo Icon
  // Vector Editor: Menu Bar: Redo Icon
  // Vector Editor; Circular DNA Icon
  // Vector Editor: Linear DNA Icon
  // Vector Editor: Feature Icon
  // Vector Editor: Part Icon
  // Vector Editor: Cut Site Icon
  // Vector Editor: ORF Icon
  // Vector Editor: Expand Icon
  // Vector Editor: (select a feature)
  // Vector Editor: (click drag over features)
  // Vector Editor: (click drag over sequences)
  // Vector Editor: (insert, delete, right arrow, left arrow, click drag delete, copy paste insert)
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  console.warn("err, runnable:", err, runnable);
  return false;
});

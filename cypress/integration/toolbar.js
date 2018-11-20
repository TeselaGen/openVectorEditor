
describe("toolbar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  

  it("can open the cutsite dropdown and add an additional enzyme", function() {
    cy.get("[data-test=cutsiteToolDropdown]").click();
    // debugger
    // cy.get(".ve-toolbar-dropdown");
    cy.contains("Single cutters")
    cy.get(".Select-control").click();
    cy.contains("Add additional enzymes").click()
    cy.contains("Select cut sites").click()
    cy.contains("AanI").click()
    cy.contains("Cuts 2 times").click()
    cy.contains("Add Enzyme").click()
    cy.get(".ve-toolbar-dropdown").contains("Cuts 2 times")
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

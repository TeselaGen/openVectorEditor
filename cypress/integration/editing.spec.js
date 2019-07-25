describe("editor", function() {
  beforeEach(() => {
    cy.visit("");
  });
  // it.only(`should handle focus correctly while editing`, ()=> {
  //   cy.selectRange(5297, 3);
  //   cy.deleteSelection();
  //   // cy.window()
  // })

  it(`should be able to delete data around the origin correctly
  - the cursor should be place at the origin`, () => {
    cy.selectRange(5297, 3);
    cy.deleteSelection();
    cy.contains("Caret Between Bases 5293 and 1");
    cy.contains(".ve-row-item-sequence", /^gtcttatga/);
  });
  it(`should be able to insert data around the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.replaceSelection("aaaaaa");
    cy.contains("Selecting 6 bps from 1 to 6");
    cy.contains(".ve-row-item-sequence", /^aaaaaagtcttatga/);
    cy.selectRange(3, 5);
    cy.replaceSelection("tt");
    cy.contains("Selecting 2 bps from 3 to 4");
  });
  it(`should be able to revComp, comp selections that wrap the origin correctly 
  - new sequence should be inserted after the origin`, () => {
    cy.selectRange(5297, 3);
    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", /Complement Selection/).click();
    cy.contains(".ve-row-item-sequence", /^ctggtcttat/);

    cy.contains("button", "Edit").click();
    cy.contains(".bp3-menu-item", "Reverse Complement Selection").click();

    cy.contains("Selecting 6 bps from 5297 to 3");
    cy.contains(".ve-row-item-sequence", /^ctagtcttatg/);
  });
});

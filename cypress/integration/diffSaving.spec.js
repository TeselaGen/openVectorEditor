describe("diffSaving", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("passes an optional diff that can be used to save instead of saving the whole seq info", function() {
    cy.selectRange(5297, 3);
    cy.replaceSelection("aaaaaa");
    cy.contains("Selecting 6 bps from 1 to 6");
    cy.contains(".ve-row-item-sequence", /^aaaaaagtcttatga/);
    cy.selectRange(3, 5);
    cy.replaceSelection("tt");
    cy.contains("Selecting 2 bps from 3 to 4");
    cy.get(`.ve-tool-container-saveTool:not(.disabled)`).click();
    cy.window().then(win => {
      console.log(`win.diffUtils:`, win.diffUtils);
      console.log(`win.initialSeqData:`, win.initialSeqData);
      console.log(`win.currentSeqData:`, win.currentSeqData);
      console.log(`win.diffToUse:`, win.diffToUse);

      win.diffToUse.forEach(d => {
        console.log(`win.initialSeqData:`, win.initialSeqData);
        console.log(`d:`, d);
        win.initialSeqData = win.diffUtils.patchSeqWithDiff(
          win.initialSeqData,
          d
        );
      });
      expect(
        win.diffUtils.getDiffFromSeqs(win.initialSeqData, win.currentSeqData)
      ).to.eq(undefined);
      console.log(`win.initialSeqData_updated_from_diff:`, win.initialSeqData);

      expect(win.diffToUse.length).to.eql(2);
    });
    cy.clearToasts()
    cy.get(`.ve-tool-container-undoTool:not(.disabled)`).click();
    cy.get(`.ve-tool-container-undoTool:not(.disabled)`).click();
    cy.get(`.ve-tool-container-saveTool:not(.disabled)`).click();
    
    cy.window().then(win => {
      console.log(`win.diffUtils:`, win.diffUtils);
      console.log(`win.initialSeqData:`, win.initialSeqData);
      console.log(`win.currentSeqData:`, win.currentSeqData);
      console.log(`win.diffToUse:`, win.diffToUse);

      win.diffToUse.forEach(d => {
        console.log(`win.initialSeqData:`, win.initialSeqData);
        console.log(`d:`, d);
        win.initialSeqData = win.diffUtils.patchSeqWithDiff(
          win.initialSeqData,
          d
        );
      });
      expect(
        win.diffUtils.getDiffFromSeqs(win.initialSeqData, win.currentSeqData)
      ).to.eq(undefined);
      console.log(`win.initialSeqData_updated_from_diff:`, win.initialSeqData);

      expect(win.diffToUse.length).to.eql(2);
    });
  });
});

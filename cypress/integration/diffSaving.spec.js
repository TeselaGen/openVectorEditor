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
      win.lastSavedSeqData = win.currentSeqData;

      win.diffToUse.forEach(d => {
        win.initialSeqData = win.diffUtils.patchSeqWithDiff(
          win.initialSeqData,
          d,
          { ignoreKeys: ["stateTrackingId"] }
        );
      });

      expect(
        win.diffUtils.getDiffFromSeqs(win.initialSeqData, win.currentSeqData, {
          ignoreKeys: ["stateTrackingId"]
        })
      ).to.eq(undefined);

      expect(win.diffToUse.length).to.eql(2);
    });

    cy.hideToasts();
    cy.get(`.ve-tool-container-undoTool:not(.disabled)`).click();
    cy.get(`.ve-tool-container-undoTool:not(.disabled)`).click();
    cy.get(`.ve-tool-container-saveTool:not(.disabled)`).click();

    cy.window().then(win => {
      win.diffToUse.forEach(d => {
        win.lastSavedSeqData = win.diffUtils.patchSeqWithDiff(
          win.lastSavedSeqData,
          d,
          { ignoreKeys: ["stateTrackingId"] }
        );
      });
      const diffBetweenUpdatedSeqDataAndCurrentSeqData = win.diffUtils.getDiffFromSeqs(
        win.lastSavedSeqData,
        win.currentSeqData,
        { ignoreKeys: ["stateTrackingId"] }
      );

      expect(diffBetweenUpdatedSeqDataAndCurrentSeqData).to.eq(undefined);

      expect(win.diffToUse.length).to.eql(2);
    });
  });
  it("the diff being passed is correct when undo's and redos have been done", function() {
    cy.contains(".veLabelText", "araD").rightclick();
    cy.contains(".bp3-menu-item", "Delete Feature").click();

    cy.selectRange(3, 5);
    cy.replaceSelection("tt");
    cy.contains("Selecting 2 bps from 3 to 4");
    cy.hideToasts();

    cy.get(`.ve-tool-container-undoTool:not(.disabled)`).click();
    cy.hideToasts();

    cy.get(`.ve-tool-container-saveTool:not(.disabled)`).click();
    cy.window().then(win => {
      win.diffToUse.forEach(d => {
        win.initialSeqData = win.diffUtils.patchSeqWithDiff(
          win.initialSeqData,
          d,
          { ignoreKeys: ["stateTrackingId"] }
        );
      });

      expect(
        win.diffUtils.getDiffFromSeqs(win.initialSeqData, win.currentSeqData, {
          ignoreKeys: ["stateTrackingId"]
        })
      ).to.eq(undefined);

      expect(win.diffToUse.length).to.eql(1);
    });
  });
});

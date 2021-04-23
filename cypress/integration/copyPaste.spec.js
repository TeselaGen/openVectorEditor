describe("copyPaste", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`should be able to copy reverse complement`, () => {
    cy.selectRange(10, 12); //select some random range (we were seeing an error where the selection layer wasn't getting updated correctly)
    //right click a feature
    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Copy").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Copy Reverse Complement").click();
    cy.window().then((win) => {
      assert(
        win.__tg_copiedSeqData.sequence ===
          "atggctgaagcgcaaaatgatcccctgctgccgggatactcgtttaatgcccatctggtggcgggtttaacgccgattgaggccaacggttatctcgatttttttatcgaccgaccgctgggaatgaaaggttatattctcaatctcaccattcgcggtcagggggtggtgaaaaatcagggacgagaatttgtttgccgaccgggtgatattttgctgttcccgccaggagagattcatcactacggtcgtcatccggaggctcgcgaatggtatcaccagtgggtttactttcgtccgcgcgcctactggcatgaatggcttaactggccgtcaatatttgccaatacggggttctttcgcccggatgaagcgcaccagccgcatttcagcgacctgtttgggcaaatcattaacgccgggcaaggggaagggcgctattcggagctgctggcgataaatctgcttgagcaattgttactgcggcgcatggaagcgattaacgagtcgctccatccaccgatggataatcgggtacgcgaggcttgtcagtacatcagcgatcacctggcagacagcaattttgatatcgccagcgtcgcacagcatgtttgcttgtcgccgtcgcgtctgtcacatcttttccgccagcagttagggattagcgtcttaagctggcgcgaggaccaacgtatcagccaggcgaagctgcttttgagcaccacccggatgcctatcgccaccgtcggtcgcaatgttggttttgacgatcaactctatttctcgcgggtatttaaaaaatgcaccggggccagcccgagcgagttccgtgccggttgtgaagaaaaagtgaatgatgtagccgtcaagttgtcataa"
      );
    });
  });
  it(`should be able to copy normal sequence`, () => {
    cy.selectRange(10, 12); //select some random range (we were seeing an error where the selection layer wasn't getting updated correctly)
    //right click a feature
    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    // cy.contains(".bp3-menu-item", "Copy").trigger("mouseover")
    cy.contains(".bp3-menu-item", "Copy").click();
    cy.window().then((win) => {
      assert(
        win.__tg_copiedSeqData.sequence ===
          "ttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccat"
      );
    });
  });
  it(`copy options should toggle correctly when triggered from a selection layer`, () => {
    //right click a feature
    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    // cy.contains(".bp3-menu-item", "Copy").trigger("mouseover")
    cy.contains(".bp3-menu-item", "Copy").trigger("mouseover", { force: true });
    cy.contains(".bp3-menu-item", "Copy Options").trigger("mouseover", {
      force: true
    });
    cy.get(
      `.bp3-menu-item:contains("Include Features") .bp3-icon-small-tick`
    ).should("exist");
    cy.contains(".bp3-menu-item", "Include Features").click();
    cy.get(
      `.bp3-menu-item:contains("Include Features") .bp3-icon-small-tick`
    ).should("not.exist");
  });
});

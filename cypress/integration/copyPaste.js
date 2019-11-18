// import dragMock from 'drag-mock'

describe("copyPaste", function() {
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
    cy.window().then(win => {
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
    cy.window().then(win => {
      assert(
        win.__tg_copiedSeqData.sequence ===
          "ttatgacaacttgacggctacatcattcactttttcttcacaaccggcacggaactcgctcgggctggccccggtgcattttttaaatacccgcgagaaatagagttgatcgtcaaaaccaacattgcgaccgacggtggcgataggcatccgggtggtgctcaaaagcagcttcgcctggctgatacgttggtcctcgcgccagcttaagacgctaatccctaactgctggcggaaaagatgtgacagacgcgacggcgacaagcaaacatgctgtgcgacgctggcgatatcaaaattgctgtctgccaggtgatcgctgatgtactgacaagcctcgcgtacccgattatccatcggtggatggagcgactcgttaatcgcttccatgcgccgcagtaacaattgctcaagcagatttatcgccagcagctccgaatagcgcccttccccttgcccggcgttaatgatttgcccaaacaggtcgctgaaatgcggctggtgcgcttcatccgggcgaaagaaccccgtattggcaaatattgacggccagttaagccattcatgccagtaggcgcgcggacgaaagtaaacccactggtgataccattcgcgagcctccggatgacgaccgtagtgatgaatctctcctggcgggaacagcaaaatatcacccggtcggcaaacaaattctcgtccctgatttttcaccaccccctgaccgcgaatggtgagattgagaatataacctttcattcccagcggtcggtcgataaaaaaatcgagataaccgttggcctcaatcggcgttaaacccgccaccagatgggcattaaacgagtatcccggcagcaggggatcattttgcgcttcagccat"
      );
    });
  });
});

describe("copyPaste", function () {
  beforeEach(() => {
    cy.visit("");
  });
  it(`isProtein mode - copy genbank of protein`, () => {
    cy.get(`[data-test="moleculeType"]`).select("Protein");

    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Copy").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Copy Genbank").click();
    // cy.contains(".openVeCopy2", "Copy AA Sequence").click();
    // cy.contains(".bp3-menu-item", "Copy Reverse Complement").click();
    cy.window().then(() => {
      assert(window.Cypress.textToCopy.includes("879 aa"));
      assert(window.Cypress.textToCopy.includes("fcillaavsg"));
      assert(window.Cypress.textToCopy.includes("eelvgplyar"));
      assert(
        window.Cypress.seqDataToCopy.proteinSequence ===
          "fcillaavsgaegwgyygcdeelvgplyarslgassyyslltaprfarlhgisgwsprigdpnpwlqidlmkkhriravatqgsfnswdwvtrymllygdrvdswtpfyqrghnstffgnvnesavvrhdlhfhftaryirivplawnprgkiglrlglygcpykadilyfdgddaisyrfprgvsrslwdvfafsfkteekdglllhaegaqgdyvtlelegahlllhmslgsspiqprpghttvsaggvlndqhwhyvrvdrfgrdvnftldgyvqrfilngdferlnldtemfigglvgaarknlayrhnfrgcienvifnrvniadlavrrhsritfegkvafrcldpvphpinfggphnfvqvpgfprrgrlavsfrfrtwdltglllfsrlgdglghveltlsegqvnvsiaqsgrkklqfaagyrlndgfwhevnfvaqenhavisiddvegaevrvsypllirtgtsyffggcpkpasrwdchsnqtafhgcmellkvdgqlvnltlvegrrlgfyaevlfdtcgitdrcspnmcehdgrcyqswddficyceltgykgetchtplykesceayrlsgktsgnftidpdgsgplkpfvvycdirenrawtvvrhdrlwttrvtgssmerpflgaiqywnasweevsalanasqhceqwiefscynsrllntaggypysfwigrneeqhfywggsqpgiqrcacgldrscvdpalycncdadqpqwrtdkglltfvdhlpvtqvvigdtnrstseaqfflrplrcygdrnswntisfhtgaalrfppiranhsldvsfyfrtsapsgvflenmggpycqwrrpyvrvelntsrdvvfafdvgngdenltvhsddfefnddewhlvraeinvk"
      );
    });
  });
  it(`isProtein mode - copy protein sequence`, () => {
    cy.get(`[data-test="moleculeType"]`).select("Protein");
    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Copy").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Copy AA Sequence").click();
    // cy.contains(".openVeCopy2", "Copy AA Sequence").click();
    // cy.contains(".bp3-menu-item", "Copy Reverse Complement").click();
    cy.window().then(() => {
      assert(
        window.Cypress.textToCopy ===
          "FCILLAAVSGAEGWGYYGCDEELVGPLYARSLGASSYYSLLTAPRFARLHGISGWSPRIGDPNPWLQIDLMKKHRIRAVATQGSFNSWDWVTRYMLLYGDRVDSWTPFYQRGHNSTFFGNVNESAVVRHDLHFHFTARYIRIVPLAWNPRGKIGLRLGLYGCPYKADILYFDGDDAISYRFPRGVSRSLWDVFAFSFKTEEKDGLLLHAEGAQGDYVTLELEGAHLLLHMSLGSSPIQPRPGHTTVSAGGVLNDQHWHYVRVDRFGRDVNFTLDGYVQRFILNGDFERLNLDTEMFIGGLVGAARKNLAYRHNFRGCIENVIFNRVNIADLAVRRHSRITFEGKVAFRCLDPVPHPINFGGPHNFVQVPGFPRRGRLAVSFRFRTWDLTGLLLFSRLGDGLGHVELTLSEGQVNVSIAQSGRKKLQFAAGYRLNDGFWHEVNFVAQENHAVISIDDVEGAEVRVSYPLLIRTGTSYFFGGCPKPASRWDCHSNQTAFHGCMELLKVDGQLVNLTLVEGRRLGFYAEVLFDTCGITDRCSPNMCEHDGRCYQSWDDFICYCELTGYKGETCHTPLYKESCEAYRLSGKTSGNFTIDPDGSGPLKPFVVYCDIRENRAWTVVRHDRLWTTRVTGSSMERPFLGAIQYWNASWEEVSALANASQHCEQWIEFSCYNSRLLNTAGGYPYSFWIGRNEEQHFYWGGSQPGIQRCACGLDRSCVDPALYCNCDADQPQWRTDKGLLTFVDHLPVTQVVIGDTNRSTSEAQFFLRPLRCYGDRNSWNTISFHTGAALRFPPIRANHSLDVSFYFRTSAPSGVFLENMGGPYCQWRRPYVRVELNTSRDVVFAFDVGNGDENLTVHSDDFEFNDDEWHLVRAEINVK"
      );
      assert(
        window.Cypress.seqDataToCopy.proteinSequence ===
          "fcillaavsgaegwgyygcdeelvgplyarslgassyyslltaprfarlhgisgwsprigdpnpwlqidlmkkhriravatqgsfnswdwvtrymllygdrvdswtpfyqrghnstffgnvnesavvrhdlhfhftaryirivplawnprgkiglrlglygcpykadilyfdgddaisyrfprgvsrslwdvfafsfkteekdglllhaegaqgdyvtlelegahlllhmslgsspiqprpghttvsaggvlndqhwhyvrvdrfgrdvnftldgyvqrfilngdferlnldtemfigglvgaarknlayrhnfrgcienvifnrvniadlavrrhsritfegkvafrcldpvphpinfggphnfvqvpgfprrgrlavsfrfrtwdltglllfsrlgdglghveltlsegqvnvsiaqsgrkklqfaagyrlndgfwhevnfvaqenhavisiddvegaevrvsypllirtgtsyffggcpkpasrwdchsnqtafhgcmellkvdgqlvnltlvegrrlgfyaevlfdtcgitdrcspnmcehdgrcyqswddficyceltgykgetchtplykesceayrlsgktsgnftidpdgsgplkpfvvycdirenrawtvvrhdrlwttrvtgssmerpflgaiqywnasweevsalanasqhceqwiefscynsrllntaggypysfwigrneeqhfywggsqpgiqrcacgldrscvdpalycncdadqpqwrtdkglltfvdhlpvtqvvigdtnrstseaqfflrplrcygdrnswntisfhtgaalrfppiranhsldvsfyfrtsapsgvflenmggpycqwrrpyvrvelntsrdvvfafdvgngdenltvhsddfefnddewhlvraeinvk"
      );
    });
  });
  it(`should be able to copy reverse complement`, () => {
    cy.selectRange(10, 12); //select some random range (we were seeing an error where the selection layer wasn't getting updated correctly)
    //right click a feature
    cy.contains(".veRowViewFeature", "araC")
      .first()
      .trigger("contextmenu", { force: true });
    cy.contains(".bp3-menu-item", "Copy").trigger("mouseover");
    cy.contains(".bp3-menu-item", "Copy Reverse Complement").click();
    cy.window().then(() => {
      assert(
        window.Cypress.seqDataToCopy.sequence ===
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
    cy.contains(".openVeCopy2", "Copy").click();
    cy.window().then(() => {
      assert(
        window.Cypress.seqDataToCopy.sequence ===
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
    cy.contains(".bp3-menu-item", "Include Features").click({ force: true });
    cy.get(
      `.bp3-menu-item:contains("Include Features") .bp3-icon-small-tick`
    ).should("not.exist");
  });
});

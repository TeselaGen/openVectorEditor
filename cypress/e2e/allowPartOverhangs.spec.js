describe("allowPartOverhangs", function () {
  it(`allowPartOverhangs option should work as expected`, () => {
    cy.visit("http://localhost:3344/#/Editor?allowPartOverhangs=true");
    cy.get(".veCircularViewPart:contains(Diges..)").click();
    cy.get(".partWithOverhangsIndicator");
    cy.get(`[data-partoverhang="cgcg"]`);
  });
});

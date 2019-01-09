// import dragMock from 'drag-mock'

describe("tabs", function() {
  beforeEach(() => {
    cy.visit("/#/SimpleCircularOrLinearView");
  });
  it("can toggle a part hover", function() {
    cy.tgToggle("circular");
    cy.get(".veCircularViewLabelText.veAnnotationHovered").should("not.exist");
    cy.tgToggle("hoverPart");
    cy.get(".veCircularViewLabelText.veAnnotationHovered").should("exist");
  });
  it("can toggle changing size", function() {
    cy.get(`.veLinearView`)
      .invoke("outerHeight")
      .should("equal", 300);
    cy.get(`.veLinearView`)
      .invoke("outerWidth")
      .should("equal", 300);
    cy.tgToggle("changeSize");
    cy.get(`.veLinearView`)
      .invoke("outerHeight")
      .should("equal", 500);
    cy.get(`.veLinearView`)
      .invoke("outerWidth")
      .should("equal", 500);
  });
});

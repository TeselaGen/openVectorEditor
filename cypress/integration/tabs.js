describe("toolbar", function() {
  beforeEach(() => {
    cy.visit("");
  });
  it("can switch between tabs", function() {
    cy.contains("Linear Map").click();
    cy.get(".veLinearView");
    cy.contains("Plasmid").click();
    cy.get(".veCircularView");
  });
  // it.only('can drag tabs around', function() {
  //   cy.contains("Sequence Map").then((el) => {
  //     const {top, left } = el.offset()

  //     cy.contains('Linear Map')
  //     .trigger('mousedown', {which: 1})
  //     .trigger('dragstart', {which: 1})
  //     // .wait(5000)
  //     .trigger('drag', { which: 1, clientX: left + 80, clientY: top + 10 })
  //     // .wait(1000)
  //     // .trigger('dragend', {which: 1})
  // .trigger('mouseup', {force: true})
  //     // .trigger('mousedown', { which: 1 })
  //     // .trigger('dragstart')
  //     // .trigger('drag', {})
  //   })
  // })
});

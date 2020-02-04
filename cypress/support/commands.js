const { isString } = require("lodash");

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function getCenter(el) {
  const b = el.getBoundingClientRect();
  const x = (b.right - b.left) / 2 + b.left;
  const y = (b.bottom - b.top) / 2 + b.top;
  return [x, y];
}

Cypress.Commands.add("dragBetween", (dragSelector, dropSelector) => {
  const getOrWrap = isString(dragSelector) ? cy.get : cy.wrap;
  cy.clock();
  getOrWrap(dragSelector).then(el => {
    let dragSelectDomEl = el.get(0);
    getOrWrap(dropSelector).then(el2 => {
      let dropSelectDomEl = el2.get(0);
      const [x, y] = getCenter(dragSelectDomEl);
      const [xCenterDrop, yCenterDrop] = getCenter(dropSelectDomEl);
      getOrWrap(dragSelector)
        .trigger(
          "mousedown",
          {
            button: 0,
            clientX: x,
            clientY: y,
            force: true
          },
          { force: true }
        )
        .tick(1000);
      // drag events test for button: 0 and also use the clientX and clientY values - the clientX and clientY values will be specific to your system
      getOrWrap(dragSelector)
        .trigger(
          "mousemove",
          {
            button: 0,
            clientX: x + 10,
            clientY: y + 10,
            force: true
          },
          { force: true }
        ) // We perform a small move event of > 5 pixels this means we don't get dismissed by the sloppy click detection
        .tick(5000); // react-beautiful-dnd has a minimum 150ms timeout before starting a drag operation, so wait at least this long.

      cy.get("html") // now we perform drags on the whole screen, not just the draggable
        .trigger(
          "mousemove",
          {
            button: 0,
            clientX: xCenterDrop,
            clientY: yCenterDrop,
            force: true
          },
          { force: true }
        )
        .tick(5000);
      cy.get("html").trigger(
        "mouseup",
        {
          // Causes the drop to be run
          button: 0,
          clientX: xCenterDrop,
          clientY: yCenterDrop,
          force: true
        },
        { force: true }
      );
      getOrWrap(dragSelector).trigger(
        "mouseup",
        {
          // Causes the drop to be run
          button: 0,
          clientX: xCenterDrop,
          clientY: yCenterDrop,
          force: true
        },
        { force: true }
      );

      // Can now test the application's post DROP state
    });
  });
});

Cypress.Commands.add("dragBetweenSimple", (dragSelector, dropSelector) => {
  const getOrWrap = selector =>
    isString(selector)
      ? cy.get(selector).then(el => {
          return el.first();
        })
      : cy.wrap(selector);
  getOrWrap(dragSelector)
    .trigger("mousedown", { force: true })
    .trigger("mousemove", 10, 10, { force: true });
  getOrWrap(dropSelector)
    .trigger("mousemove", { force: true })
    .trigger("mouseup", { force: true });
});

Cypress.Commands.add("tgToggle", (type, onOrOff = true) => {
  /* eslint-disable no-unexpected-multiline*/

  return cy
    .get(`[data-test="${type}"]`)
    [onOrOff ? "check" : "uncheck"]({ force: true });
  /* eslint-enable no-unexpected-multiline*/
});

/**
 * Triggers a cmd using the Help menu search
 * @memberOf Cypress.Chainable#
 * @name triggerFileCmd
 * @function
 * @param {String} text - the file cmd to trigger
 */

Cypress.Commands.add("triggerFileCmd", text => {
  cy.get("body").type("{meta}/");
  cy.focused().type(`${text}{enter}`);
});

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name upload_file
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 */

Cypress.Commands.add("uploadFile", (selector, fileUrl, type = "") => {
  return cy
    .fixture(fileUrl, "base64")
    .then(Cypress.Blob.base64StringToBlob)
    .then(blob => {
      const name = fileUrl.split("/").pop();
      const testFile = new File([blob], name, { type });
      const event = { dataTransfer: { files: [testFile] } };
      return cy.get(selector).trigger("drop", event);
    });
});

Cypress.Commands.add("selectRange", (start, end) => {
  cy.window().then(win => {
    win.ove_updateEditor({
      selectionLayer: {
        start: start - 1,
        end: end - 1
      }
    });
  });
});
Cypress.Commands.add("closeDialog", () => {
  cy.get(`.bp3-dialog [aria-label="Close"]`).click();
});
Cypress.Commands.add("replaceSelection", sequenceString => {
  cy.get(".veRowViewSelectionLayer")
    .first()
    .trigger("contextmenu", { force: true });
  cy.contains(".bp3-menu-item", "Replace").click();
  cy.get(".sequenceInputBubble input").type(`${sequenceString}{enter}`);
});
Cypress.Commands.add("deleteSelection", () => {
  cy.get(".veRowViewSelectionLayer")
    .first()
    .trigger("contextmenu", { force: true });
  cy.contains(".bp3-menu-item", "Cut").click();
});

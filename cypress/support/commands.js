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
  cy.get(".tg-menu-bar")
    .contains("Edit")
    .click();
  cy.get(".tg-menu-bar-popover")
    .contains("Select")
    .click();
  cy.get(`[label="From:"]`)
    .clear()
    .type(start);
  cy.get(`[label="To:"]`)
    .clear()
    .type(end);
  cy.get(".tg-min-width-dialog")
    .contains("OK")
    .click();
});

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "@cypress/code-coverage/support";
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

//filter out socketIO requests here
// tnr: I don't think we need this in OVE, but either way cy.server has been removed
// beforeEach(function () {
//   cy.server({
//     ignore: (xhr) => {
//       //filter out socketIO requests here
//       if (xhr.url.indexOf("socket.io/") > -1) return true;
//       if (xhr.url.indexOf("sockjs-node/") > -1) return true;
//       //return the default cypress ignore filer
//       return xhr.method === "GET" && /\.(jsx?|html|css)(\?.*)?$/.test(xhr.url);
//     }
//   });
// });

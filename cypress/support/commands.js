const { isString } = require("lodash");
const toRegexRange = require("to-regex-range");
const { insertSequenceDataAtPositionOrRange } = require("ve-sequence-utils");

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
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
//   return originalFn(url, options).then(() => {
//     cy.window().then((win) => {
//       win.sessionStorage.clear();
//     });
//   });
// });

function getCenter(el) {
  const b = el.getBoundingClientRect();
  const x = (b.right - b.left) / 2 + b.left;
  const y = (b.bottom - b.top) / 2 + b.top;
  return [x, y];
}

Cypress.Commands.add("dragBetween", (dragSelector, dropSelector) => {
  const getOrWrap = isString(dragSelector) ? cy.get : cy.wrap;
  cy.clock();
  getOrWrap(dragSelector).then((el) => {
    const dragSelectDomEl = el.get(0);
    getOrWrap(dropSelector).then((el2) => {
      const dropSelectDomEl = el2.get(0);
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
  const getOrWrap = (selector) =>
    isString(selector)
      ? cy.get(selector).then((el) => {
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

Cypress.Commands.add("triggerFileCmd", (text, { noEnter } = {}) => {
  cy.get("body").type("{meta}/");
  cy.focused().type(`${text}${noEnter ? "" : "{enter}"}`, { delay: 1 });
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
  return cy.fixture(fileUrl, "base64").then((input) => {
    const blob = Cypress.Blob.base64StringToBlob(input);

    const name = fileUrl.split("/").pop();
    return cy.window().then((win) => {
      // this is using the File constructor from the application window
      const testFile = new win.File([blob], name, { type });
      const event = { dataTransfer: { files: [testFile], types: ["Files"] } };
      return cy.get(selector).trigger("drop", event);
    });
  });
});

/**
 * Used to find our sequence selection within a range given a tolerance
 * @param {*} min - minimum value for range
 * @param {*} max - maxmimum value for range
 * @param {*} tolerance - tolerance allowed for our start point and interval for selected sequence
 */
Cypress.Commands.add(
  "assertSelectionWithinRange",
  ({ min, max, tolerance }) => {
    const minRange = toRegexRange(min - tolerance, min + tolerance);
    const maxRange = toRegexRange(max - tolerance, max + tolerance);
    const intervalRange = toRegexRange(
      max - min - tolerance,
      max - min + tolerance
    );
    cy.window().then(() => {
      const checkString = new RegExp(
        "Selecting " +
          intervalRange +
          " bps from " +
          minRange +
          " to " +
          maxRange
      );
      cy.contains(checkString);
    });
  }
);

/**
 * Used to find caret within a range with a given tolerance
 * @param {*} min - minimum value for caret search range
 * @param {*} max - maxmimum value for caret search range
 * @param {*} tolerance - tolerance for min and max
 */
// Cypress.Commands.add("getCaretWithinRange", ({min,max,tolerance}) => {
//   const minRange = toRegexRange(min-tolerance,min+tolerance)
//   const maxRange = toRegexRange(max-tolerance,max+tolerance)
//   const checkString = new RegExp(`[title="Caret Between Bases ` + minRange + ` and ` + maxRange + `"]`)
//   cy.get(checkString)
//   });

Cypress.Commands.add("selectRange", (start, end) => {
  cy.log(`selectRange ${start} - ${end}`);
  cy.window().then((win) => {
    win.ove_updateEditor({
      selectionLayer: {
        start: start - 1,
        end: end - 1
      }
    });
  });
});

/**
 * Update the editor
 */
// Cypress.Commands.add("updateEditor", ({min,max,tolerance}) => {
//   const minRange = toRegexRange(min-tolerance,min+tolerance)
//   const maxRange = toRegexRange(max-tolerance,max+tolerance)
//   const checkString = new RegExp(`[title="Caret Between Bases ` + minRange + ` and ` + maxRange + `"]`)
//   cy.get(checkString)
//   });

Cypress.Commands.add("updateEditor", (props) => {
  cy.log(`updateEditor`);
  cy.window().then((win) => {
    win.ove_updateEditor(props);
  });
});

Cypress.Commands.add("deleteRange", (start, end) => {
  cy.window().then((win) => {
    const { sequenceData } = win.ove_getEditorState();
    const newSeqData = insertSequenceDataAtPositionOrRange({}, sequenceData, {
      start,
      end
    });

    win.ove_updateEditor({
      sequenceData: newSeqData
    });
  });
});

Cypress.Commands.add("removeFeatures", () => {
  cy.window().then((win) => {
    win.ove_updateEditor({
      justPassingPartialSeqData: true,
      sequenceData: {
        features: []
      }
    });
  });
});
Cypress.Commands.add("hideCutsites", () => {
  cy.window().then((win) => {
    win.ove_updateEditor({
      annotationVisibility: {
        cutsites: false
      }
    });
  });
});
Cypress.Commands.add("hideParts", () => {
  cy.window().then((win) => {
    win.ove_updateEditor({
      annotationVisibility: {
        parts: false
      }
    });
  });
});
Cypress.Commands.add("selectAlignmentRange", (start, end) => {
  window.Cypress.updateAlignmentSelection({ start: start - 1, end: end - 1 });
});
Cypress.Commands.add("scrollAlignmentToPercent", (percent) => {
  window.Cypress.scrollAlignmentToPercent(percent);
});
Cypress.Commands.add("closeDialog", () => {
  cy.get(`.bp3-dialog [aria-label="Close"]`).click();
});
Cypress.Commands.add("replaceSelection", (sequenceString) => {
  cy.get(".veRowViewSelectionLayer")
    .first()
    .trigger("contextmenu", { force: true });
  cy.contains(".bp3-menu-item", "Replace").click();
  cy.get(".sequenceInputBubble input").type(`${sequenceString}{enter}`);
});
Cypress.Commands.add("deleteSelection", () => {
  cy.get(
    ".veRowViewSelectionLayer.notCaret:not(.cutsiteLabelSelectionLayer):not(.veSearchLayer)"
  )
    .first()
    .trigger("contextmenu", { force: true });
  cy.contains(".bp3-menu-item", "Cut").click();
});

Cypress.Commands.add("waitForDialogClose", ({ timeout } = {}) => {
  cy.get(".bp3-dialog", {
    timeout
  }).should("not.exist");
});

Cypress.Commands.add("waitForMenuClose", ({ timeout } = {}) => {
  cy.get(".bp3-menu", {
    timeout
  }).should("not.exist");
});

Cypress.Commands.add("closeDialog", ({ timeout } = {}) => {
  cy.get(".bp3-dialog-close-button").click();
  cy.waitForDialogClose({ timeout });
});
Cypress.Commands.add("hideMenu", () => {
  cy.get(".bp3-popover").invoke("hide");
});

Cypress.Commands.add("closeToasts", () => {
  cy.window().then((win) => {
    win.__tgClearAllToasts();
  });
});

// Cypress.Commands.overwrite(
//   "type",
//   (originalFn, subject, text, options = {}) => {
//     if (text === "{selectall}{del}") {
//       return originalFn(subject, text, options); //pass thru .clear() calls
//     } else if (options.passThru) {
//       return originalFn(subject, text, options); //pass thru .clear() calls
//     } else {
//       cy.wrap(subject, { log: false })
//         .invoke("val")
//         .then((prevValue) => {
//           if (
//             options.passThru ||
//             options.parseSpecialCharSequences === false ||
//             (text.includes && text.includes("{")) //if special chars are getting used just pass them thru
//           ) {
//             // eslint-disable-next-line cypress/no-unnecessary-waiting
//             cy.wait(0, { log: false }).then(
//               { timeout: options.timeout || 40000 },
//               () => originalFn(subject, text, options)
//             );
//           } else {
//             // eslint-disable-next-line cypress/no-unnecessary-waiting
//             cy.wait(0, { log: false }).then(
//               { timeout: options.timeout || 40000 },
//               () => originalFn(subject, text, options)
//             );

//             const valToCheck =
//               options.assertVal ||
//               `${options.noPrevValue ? "" : prevValue}${text}`;
//             if (options.containsSelector) {
//               cy.contains(options.containsSelector, valToCheck);
//             } else {
//               // Adds guarding that asserts that the value is typed.
//               cy.wrap(subject, { log: false }).then(($el) => {
//                 // $el is a wrapped jQuery element
//                 if (!($el.val() === valToCheck)) {
//                   if (options.runCount > 5) {
//                     //if the type fails more than 5 times then throw an error
//                     console.error("Error! Tried re-typing 5 times to no avail");
//                     throw new Error(
//                       "Error! Tried re-typing 5 times to no avail"
//                     );
//                   } else {
//                     //if the type failed, retry it again up to 5 times
//                     cy.wrap(subject)
//                       .clear()
//                       .type(valToCheck, {
//                         ...options,
//                         runCount: (options.runCount || 0) + 1
//                       });
//                   }
//                 } else {
//                   //continue on, the type completed successfully!
//                 }
//               });
//             }
//           }
//         });
//     }
//   }
// );

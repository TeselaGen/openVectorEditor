import bsonObjectid from "bson-objectid";
import getRangeLength from "ve-range-utils/getRangeLength";
import $ from "jquery";
import Tether from "tether";
import getInsertBetweenVals from "ve-sequence-utils/getInsertBetweenVals";
import "./createSequenceInputPopupStyle.css";
export default function createSequenceInputPopup({
  isReplace,
  selectionLayer,
  sequenceLength,
  caretPosition,
  replacementLayerUpdate
}) {
  // changes the text in the popup editor
  function changeText(isReplace, length) {
    let pair = length > 1 || length === 0 ? "pairs" : "pair";
    if (isReplace) {
      $(".sequenceInputBubble p").html(
        "Press <b>ENTER</b> to replace bases between " +
          insertPosition[0] +
          " and " +
          insertPosition[1] +
          " with " +
          length +
          " base " +
          pair +
          "<br><br> Press <b>ESC</b> to cancel"
      );
    } else {
      $(".sequenceInputBubble p").html(
        "Press <b>ENTER</b> to insert " +
          length +
          " base " +
          pair +
          " after base " +
          insertPosition +
          "<br><br> Press <b>ESC</b> to cancel"
      );
    }
  }

  function closeInput() {
    sequenceInputBubble.remove();
  }

  let body = $(document.body);
  let caretEl = body.find(".veRowViewCaret");
  if (caretEl.length === 0) {
    //todo: eventually we should probably jump to the row view caret if it isn't visible
    caretEl = body.find(".veCaretSVG");
  }
  if (!caretEl.length) {
    return console.error(
      "there must be a caret element present in order to display the insertSequence popup"
    );
  }
  let sequenceInputBubble;
  sequenceInputBubble = $(
    `<div class='sequenceInputBubble ${isReplace ? "" : "insertInputBubble"}'> 
			<input type='text'> 
			<p></p> 
			</div>`
  );
  let insertPosition = isReplace
    ? getInsertBetweenVals(-1, selectionLayer, sequenceLength)
    : caretPosition;
  $("body").append(sequenceInputBubble);

  new Tether({
    element: sequenceInputBubble,
    target: caretEl,
    attachment: "top left",
    targetAttachment: "bottom left",
    offset: "-15px 22px",
    constraints: [
      {
        to: "scrollParent",
        // pin: true,
        attachment: "together"
      }
    ]
  });

  if (
    sequenceInputBubble.hasClass("tether-out-of-bounds-top") ||
    sequenceInputBubble.hasClass("tether-out-of-bounds-bottom")
  ) {
    closeInput(caretEl, sequenceInputBubble);
  }
  changeText(isReplace, 0);

  let input = $(".sequenceInputBubble input");
  input.focus();
  input.blur(function() {
    closeInput(caretEl, sequenceInputBubble);
  });

  input.bind("input", function(e) {
    let sanitizedVal = "";
    e.target.value.split("").forEach(letter => {
      if (isDnaLetter(letter.toLowerCase())) {
        sanitizedVal += letter;
      }
    });
    if (e.target.value.length !== sanitizedVal.length) {
      input.addClass("borderRed");
      setTimeout(function() {
        input.removeClass("borderRed");
      }, 200);
    }
    e.target.value = sanitizedVal;

    if (sanitizedVal.length < 66) {
      changeText(isReplace, input.val().length);
    }
  });

  input.data("oldValue", "").bind("input propertychange", function() {
    let $this = $(this);
    let newValue = $this.val();
    if (newValue.length > 65) {
      window.toastr.error("Can only insert up to 65 bps");
      return $this.val($this.data("oldValue"));
    }
    return $this.data("oldValue", newValue);
  });

  input.keydown(function(event) {
    // enter pressed
    if (event.keyCode === 13) {
      let rangeOrCaret = isReplace ? selectionLayer : { caretPosition };
      let inputLength = input.val() ? input.val().length : 0;
      if (inputLength > 65) {
        window.toastr.error("Can only insert up to 65 bps");
        return;
      }
      if (inputLength < 1) {
        window.toastr.error("Please insert at least 1 bp");
        return;
      }
      let toBeDeletedLength = isReplace
        ? getRangeLength(rangeOrCaret, sequenceLength)
        : 0;
      if (sequenceLength - toBeDeletedLength + inputLength < 100) {
        window.toastr.error("Insert plus backbone must be greater than 100bps");
        return;
      }
      replacementLayerUpdate({
        id: bsonObjectid().toString(),
        range: { ...rangeOrCaret, sequence: input.val() }
      });
      closeInput(caretEl, sequenceInputBubble);
    } else if (event.keyCode === 27) {
      // escape pressed
      closeInput(caretEl, sequenceInputBubble);
    }
  });
}

let letters = {
  a: true,
  t: true,
  c: true,
  g: true
};
function isDnaLetter(char) {
  if (!char || !char.toLowerCase) {
    return false;
  }
  return letters[char.toLowerCase()];
}

import {
  isElWithinAnotherEl,
  isElWithinAnotherElWithDiff
} from "../withEditorInteractions/isElementInViewport";

export function updateLabelsForInViewFeatures({
  rectElement = ".veLinearView"
} = {}) {
  const feats = Array.from(
    document.querySelectorAll(`.veLinearView .veRowViewFeature`)
  );
  const parts = Array.from(
    document.querySelectorAll(`.veLinearView .veRowViewPart`)
  );
  const primers = Array.from(
    document.querySelectorAll(`.veLinearView .veRowViewPrimer`)
  );
  const els = [...feats, ...parts, ...primers];
  const boundingRect = document
    .querySelector(rectElement)
    .getBoundingClientRect();

  els.forEach((el) => {
    const elBounds = el.getBoundingClientRect();
    const isElIn = isElWithinAnotherEl(elBounds, boundingRect);

    if (isElIn) {
      const label = el.querySelector(".veLabelText");
      if (!label) return;
      const labelBounds = label.getBoundingClientRect();
      const [isLabelIn, diff] = isElWithinAnotherElWithDiff(labelBounds, {
        left: Math.max(boundingRect.left, elBounds.left),
        right: Math.min(boundingRect.right, elBounds.right)
      });
      if (!isLabelIn) {
        const l = window.getComputedStyle(label, null),
          t = l.getPropertyValue("transform");

        // If t return other than "none"
        // Split content into several value
        // The fourth one is the translateX value

        if (t !== "none") {
          const v = t.split("(")[1],
            // w = v.split(")")[0],
            x = v.split(",");

          const newX = Number(x[4]) + diff;
          const newY = Number(x[5].replace(")", ""));
          label.setAttribute("transform", `translate(${newX},${newY})`);
        }
      }
    }
  });
}

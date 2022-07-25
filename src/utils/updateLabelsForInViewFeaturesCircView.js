// import {
//   isElWithinAnotherEl,
//   isElWithinAnotherElWithDiff
// } from "../withEditorInteractions/isElementInViewport";

// export function updateLabelsForInViewFeaturesCircView({
//   rectElement = ".veCircularView",
//   radius
// } = {}) {
//   const feats = Array.from(
//     document.querySelectorAll(`.veCircularView .veFeature`)
//   );
//   // const parts = Array.from(
//   //   document.querySelectorAll(`.veCircularView .vePart`)
//   // );
//   // const primers = Array.from(
//   //   document.querySelectorAll(`.veCircularView .vePrimer`)
//   // );
//   const els = [...feats];
//   // const els = [...feats, ...parts, ...primers];
//   const boundingRect = document
//     .querySelector(rectElement)
//     .getBoundingClientRect();
//   els.forEach((el) => {
//     // const elBounds = el.getBoundingClientRect();
//     // const isElIn = isElWithinAnotherEl(elBounds, boundingRect);
//     const label = el.querySelector(".veLabelText");
//     if (!label) return;
//     const labelBounds = label.getBoundingClientRect();
//     const [isLabelIn, diff] = isElWithinAnotherElWithDiff(labelBounds, {
//       left: Math.max(boundingRect.left, 0 /*  elBounds.left */),
//       right: Math.min(boundingRect.right, 0 /*  elBounds.right */)
//     });
//     if (!isLabelIn) {
//       label.setAttribute("transform", `rotate(-40)`);
//     }
//     // if (isElIn) {

//     // }
//   });
// }

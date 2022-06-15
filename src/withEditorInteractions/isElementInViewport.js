// export function isElementInViewport(el, log) {
//   const rect = el.getBoundingClientRect();
//   // console.log(`rect:`, rect);
//   const st = window.getComputedStyle(el);
//   // console.log(`st.transform:`, st.transform);
//   let x = 0;
//   if (st.transform !== "none") {
//     x = parseTransform(st.transform);
//   }
//   // const topLeft_pos = st.transform !== 'none'
//   //   ? convertCoord(
//   //       parseTransform(st.transform),
//   //       rect.left,
//   //       rect.top,
//   //       st.perspective
//   //     )
//   //   : rect.left;
//   // console.log(`topLeft_pos:`, topLeft_pos);
//   console.log(`rect.right + x:`, rect.right + x);
//   return (
//     rect.top >= 0 &&
//     rect.left + x >= 0 &&
//     rect.bottom <=
//       (window.innerHeight ||
//         document.documentElement.clientHeight) /*or $(window).height() */ &&
//     rect.right + x <=
//       (window.innerWidth ||
//         document.documentElement.clientWidth) /*or $(window).width() */
//   );
// }

// function parseTransform(transform) {
//   //add sanity check
//   const [a, b, c, d, x, y] = transform
//     .split(/\(|,|\)/)
//     .slice(1, -1)
//     .map(function (v) {
//       return parseFloat(v);
//     });
//   return x;
// }

// function convertCoord(transformArr, x, y, z) {
//   console.log(`transformArr:`, transformArr);
//   console.log(`x,y,z:`, x, y, z);
//   //add sanity checks and default values

//   if (transformArr.length == 6) {
//     //2D matrix
//     //need some math to apply inverse of matrix
//     const t = transformArr,
//       det = t[0] * t[3] - t[1] * t[2];
//     return {
//       x: (x * t[3] - y * t[2] + t[2] * t[5] - t[4] * t[3]) / det,
//       y: (-x * t[1] + y * t[0] + t[4] * t[1] - t[0] * t[5]) / det
//     };
//   } /*if (transformArr.length > 6)*/ else {
//     //3D matrix
//     //haven't done the calculation to apply inverse of 4x4 matrix
//   }
// }

// export function isVisible(elem, boundingEl) {
//   if (!(elem instanceof Element))
//     throw Error("DomUtil: elem is not an element.");
//   const style = getComputedStyle(elem);
//   if (style.display === "none") return false;
//   if (style.visibility !== "visible") return false;
//   if (style.opacity < 0.1) return false;
//   const { left, right, top, bottom } = boundingEl.getBoundingClientRect();
//   const offsetWidth = elem.offsetWidth || 0;
//   const offsetHeigth = elem.offsetHeigth || 0;
//   if (
//     offsetWidth +
//       offsetHeigth +
//       elem.getBoundingClientRect().height +
//       elem.getBoundingClientRect().width ===
//     0
//   ) {
//     return false;
//   }
//   const elemCenter = {
//     x: elem.getBoundingClientRect().left + offsetWidth / 2,
//     y: elem.getBoundingClientRect().top + offsetHeigth / 2
//   };
//   console.log(`elemCenter:`, elemCenter);
//   if (elemCenter.x < 0) return false;
//   if (
//     elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)
//   )
//     return false;
//   if (elemCenter.y < 0) return false;
//   if (
//     elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)
//   )
//     return false;
//   // let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
//   // do {
//   //     if (pointContainer === elem) return true;
//   // } while (pointContainer = pointContainer.parentNode);
//   return false;
// }
export function isElWithinAnotherEl(el, container) {
  if (el.left > container.right) return false;
  // console.log(`el.right,container.left:`, el.right, container.left);
  if (el.right < container.left) return false;
  return true;
}
const buffer = 13;
export function isElWithinAnotherElWithDiff(el, container) {
  const elWidth = el.right - el.left;
  const containerWidth = container.right - container.left;
  const space = containerWidth - elWidth;
  if (el.right > container.right) {
    let diff = container.right - el.right - space / 2;
    if (el.left + diff < container.left + buffer) {
      //too far to the left -- aka diff too negative
      diff += container.left + buffer - el.left - diff;
    }
    return [false, diff];
  }

  if (el.left < container.left) {
    let diff = container.left - el.left + space / 2;
    if (el.right + diff + buffer > container.right) {
      //too far to the right -- aka diff too big
      diff -= el.right + diff + buffer - container.right;
    }
    return [false, diff];
  }
  return [true];
}

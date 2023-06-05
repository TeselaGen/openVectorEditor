import { getRangeAngles } from "@teselagen/range-utils";
export default function getRangeAnglesSpecial() {
  const { endAngle, totalAngle, ...rest } = getRangeAngles.apply(
    this,
    arguments
  );
  return {
    endAngle: endAngle - 0.00001, //we subtract a tiny amount because an angle of 2PI will cause nothing to be drawn!
    totalAngle: totalAngle - 0.00001, //we subtract a tiny amount because we don't want the range comparisons to treat the same angle as overlapping
    ...rest
  };
}

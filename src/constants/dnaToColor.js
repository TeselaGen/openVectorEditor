import { DNAComplementMap } from "@teselagen/sequence-utils";

const dnaToColor = {
  a: "lightgreen",
  c: "#658fff",
  g: "yellow",
  t: "#EE6262"
};
export default dnaToColor;

export function getDnaColor(char, isReverse) {
  return (
    dnaToColor[
      isReverse ? DNAComplementMap[char.toLowerCase()] : char.toLowerCase()
    ] || "lightgrey"
  );
}

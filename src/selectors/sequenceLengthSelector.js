import sequenceSelector from "./sequenceSelector";

export default function(state) {
  return sequenceSelector(state).length;
}

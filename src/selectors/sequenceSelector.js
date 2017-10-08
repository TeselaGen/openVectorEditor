import sequenceDataSelector from "./sequenceDataSelector";
export default function(state) {
  return sequenceDataSelector(state).sequence;
}

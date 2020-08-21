import { createSelector } from "reselect";
import partsSelector from "./partsSelector";
import tagsToBoldSelector from "./tagsToBoldSelector";
import forEach from "lodash";
function filteredPartsSelector(parts, tagsToBold) {
  const extractTagsFromPart = (part) => {
    return part.tags.flatMap((t) => {
      if (t.tagOptions) {
        return t.tagOptions.map((to) => {
          return { ...to, name: `${t.name}:${to.name}` };
        });
      }
      return t;
    });
  };
  const checkTagInTagsToBold = (part, boldTags) => {
    const partTagNames = extractTagsFromPart(part).map((p) => p.name);
    const boldTagNames = boldTags.map((p) => p.name);
    return partTagNames.some((n) => boldTagNames.includes(n));
  };

  //what this should do:
  //Go through every part
  // if it has a tag that is tagsToBold, set labelClassName to partWithSelectedTag and highPriorityLabel to true for the part
  // if it has a tag not in tagsToBold, or the there are no tags, delete labelClassName and highPriorityLabel
  //parts object of objects
  // const filteredParts = reduce(parts,(acc, p, k)=>{
  //   (p.tags||[]).forEach(t => {
  //     if(keyedTags[t]){
  //       p.labelClassName = "partWithSelectedTag"
  //       p.highPriorityLabel = true
  //     }
  //     else
  //       {
  //         delete p.labelClassName
  //         delete p.highPriorityLabel
  //       }
  //   });
  //   acc[k]=p
  //   return acc
  // },{})
  if (tagsToBold) {
    forEach(parts, (p) => {
      if (parts[p].tags) {
        if (checkTagInTagsToBold(parts[p], tagsToBold)) {
          parts[p].labelClassName = "partWithSelectedTag";
          //parts[p].highPriorityLabel = true;
        } else {
          delete parts[p].labelClassName;
          //delete parts[p].highPriorityLabel;
        }
      }
    });
  }
  return parts;
}
export default createSelector(
  partsSelector,
  tagsToBoldSelector,
  filteredPartsSelector
);

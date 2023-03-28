import { partsSubmenu } from "../../MenuBar/viewSubmenu";
import genericAnnotationProperties from "./GenericAnnotationProperties";
export default genericAnnotationProperties({
  annotationType: "part",
  noColor: true,
  visSubmenu: partsSubmenu,
  withTags: true,
  noType: true
});

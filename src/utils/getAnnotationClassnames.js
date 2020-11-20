import classnames from "classnames";
import { startCase } from "lodash";

export default function getAnnotationClassnames(
  { doesOverlapSelf },
  { viewName, type }
) {
  const Type = startCase(type);
  return classnames(`ve${Type}`, `ve${viewName}${Type}`, {
    doesOverlapSelf
  });
}

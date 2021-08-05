import classnames from "classnames";
import { startCase } from "lodash";

export default function getAnnotationClassnames(
  { overlapsSelf },
  { viewName, type }
) {
  const Type = startCase(type);
  return classnames(`ve${Type}`, `ve${viewName}${Type}`, {
    overlapsSelf
  });
}

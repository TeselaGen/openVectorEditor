import classnames from "classnames";
import { startCase } from "lodash";
import { singular } from "pluralize";

export default function getAnnotationClassnames(
  { doesOverlapSelf, annotationTypePlural },
  { viewName }
) {
  const type = startCase(singular(annotationTypePlural));
  return classnames(`ve${type}`, `ve${viewName}${type}`, {
    doesOverlapSelf
  });
}

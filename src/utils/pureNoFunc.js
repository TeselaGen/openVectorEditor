import { shouldUpdate } from "recompose";
import _ from "lodash";

const isEq = (o1, o2) => {
  const isEq = _.isEqualWith(o1, o2, function (val1, val2) {
    if (_.isFunction(val1) && _.isFunction(val2)) {
      return val1 === val2 || val1.toString() === val2.toString();
    }
  });
  return isEq;
};

const pure = (BaseComponent) => {
  const hoc = shouldUpdate((props, nextProps) => !isEq(props, nextProps));
  return hoc(BaseComponent);
};

export default pure;

import { pick } from "lodash";
import { shouldUpdate } from "recompose";
import _ from "lodash";

// import deepEqual from "deep-equal";

const onlyUpdateForKeys = propKeys => {
  const hoc = shouldUpdate((props, nextProps) => {
    const a = !isEq(pick(nextProps, propKeys), pick(props, propKeys));
    return a;
  });

  // if (process.env.NODE_ENV !== "production") {
  //   return BaseComponent =>
  //     setDisplayName(wrapDisplayName(BaseComponent, "onlyUpdateForKeys"))(
  //       hoc(BaseComponent)
  //     );
  // }
  return hoc;
};

export default onlyUpdateForKeys;

const isEq = (o1, o2) => {
  const isEq = _.isEqualWith(o1, o2, function(val1, val2) {
    if (_.isFunction(val1) && _.isFunction(val2)) {
      return val1 === val2 || val1.toString() === val2.toString();
    }
  });
  return isEq;
};

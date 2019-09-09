import { pick, isEqualWith, isFunction } from "lodash";
const shouldRerender = (propKeys, stateKeys, that) => {
  if (!that.hasRendered) {
    that.hasRendered = true;
    return true;
  }
  const nextProps = that.props;
  const oldProps = that.oldProps || {};
  const a = !isEq(pick(nextProps, propKeys), pick(oldProps, propKeys));
  that.oldProps = nextProps;
  const nextState = that.state;
  const oldState = that.oldState || {};
  const b =
    !isEq(pick(nextState, stateKeys), pick(oldState, stateKeys)) || !isEq;
  that.oldState = nextState;
  return a || b;
};
export default shouldRerender;

const isEq = (o1, o2) => {
  const isEq = isEqualWith(o1, o2, function(val1, val2) {
    if (isFunction(val1) && isFunction(val2)) {
      return val1 === val2 || val1.toString() === val2.toString();
    }
  });
  return isEq;
};

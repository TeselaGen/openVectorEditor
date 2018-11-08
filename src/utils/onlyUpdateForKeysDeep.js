import { pick } from "lodash";
import { shouldUpdate, setDisplayName, wrapDisplayName } from "recompose";
import deepEqual from "deep-equal";

const onlyUpdateForKeys = propKeys => {
  const hoc = shouldUpdate((props, nextProps) => {
    const a = !deepEqual(pick(nextProps, propKeys), pick(props, propKeys));
    console.log('a:',a)
    return a;
  });

  if (process.env.NODE_ENV !== "production") {
    return BaseComponent =>
      setDisplayName(wrapDisplayName(BaseComponent, "onlyUpdateForKeys"))(
        hoc(BaseComponent)
      );
  }
  return hoc;
};

export default onlyUpdateForKeys;

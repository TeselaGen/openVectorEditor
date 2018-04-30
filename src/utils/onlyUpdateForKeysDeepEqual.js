import { pick, isEqual } from "lodash";
import { shouldUpdate, setDisplayName, wrapDisplayName } from "recompose";

const onlyUpdateForKeys = propKeys => {
  const hoc = shouldUpdate((props, nextProps) => {
    const a = !isEqual(pick(nextProps, propKeys), pick(props, propKeys));
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

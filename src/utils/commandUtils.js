import { genericCommandFactory } from "teselagen-react-components";

export function oveCommandFactory(instance, commandDefs) {
  return genericCommandFactory({
    getArguments(cmdId, [ctxInfo]) {
      const args = [instance.props];
      const { store, editorClassName } = instance.props;
      if (store && editorClassName) {
        args.push(store.getState().VectorEditor[editorClassName]);
      }
      args.push(ctxInfo);
      return args;
    },
    handleReturn: () => {},
    commandDefs
  });
}

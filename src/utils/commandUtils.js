import { genericCommandFactory } from "teselagen-react-components";

export function oveCommandFactory(instance, commandDefs) {
  return genericCommandFactory({
    getArguments(cmdId, [ctxInfo]) {
      const args = [instance.props];
      const { store, editorName } = instance.props;
      if (store && editorName) {
        args.push(store.getState().VectorEditor[editorName]);
      }
      args.push(ctxInfo);
      return args;
    },
    handleReturn: () => {},
    commandDefs
  });
}

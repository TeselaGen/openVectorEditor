import testStore from './testStore'

import React from "react";
import { Provider } from "react-redux";

export default function HarnessComponent({children}) {
  return (
    <Provider store={testStore}>
      {children}
    </Provider>
  );
}

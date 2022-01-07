import React, { useMemo } from "react";
import { connect } from "react-redux";
import { FormName, formValueSelector } from "redux-form";

const tgFormValues =
  (...fieldNames) =>
  (Component) =>
  (props) => {
    return (
      <FormName>
        {(formName) => {
          const name = formName.form;
          const Wrapped = useMemo(() => {
            const selector = formValueSelector(name || "");
            const wrapper = connect((state) => {
              const vals = {};
              fieldNames.forEach((name) => {
                vals[name] = selector(state, name);
              });
              return vals;
            });
            return wrapper(Component);
          }, [name]);
          return <Wrapped {...props} />;
        }}
      </FormName>
    );
  };
export default tgFormValues;

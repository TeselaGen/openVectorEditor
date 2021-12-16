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
          const Wrapped = useMemo(() => {
            const selector = formValueSelector(formName.form || "");
            const wrapper = connect((state) => {
              const vals = {};
              fieldNames.forEach((name) => {
                vals[name] = selector(state, name);
              });
              return vals;
            });
            return wrapper(Component);
          }, [formName]);
          return <Wrapped {...props} />;
        }}
      </FormName>
    );
  };
export default tgFormValues;

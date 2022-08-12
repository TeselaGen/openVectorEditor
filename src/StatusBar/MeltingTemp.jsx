import React from "react";
import { Button, Icon, Popover, RadioGroup } from "@blueprintjs/core";

import { calculateTm, calculateNebTm } from "ve-sequence-utils";

import { isString } from "lodash";
import { popoverOverflowModifiers } from "teselagen-react-components";
import useTmType from "../utils/useTmType";

export default function MeltingTemp({
  sequence,
  WrapperToUse = (p) => <div>{p.children}</div>,
  InnerWrapper = (p) => (
    <Button minimal small>
      {p.children}
    </Button>
  )
}) {
  const [tmType, setTmType] = useTmType();
  const tm = (
    {
      default: calculateTm,
      neb_tm: calculateNebTm
    }[tmType] || calculateTm
  )((sequence || "").toLowerCase());
  const hasWarning = isString(tm) && tm.length > 7 && tm;
  return (
    <WrapperToUse dataTest="veStatusBar-selection-tm">
      <Popover
        modifiers={popoverOverflowModifiers}
        content={
          <div style={{ maxWidth: 300, padding: 20 }}>
            Using Tm calculations based on these{" "}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/TeselaGen/ve-sequence-utils"
            >
              algorithms
            </a>
            <br></br>
            <br></br>
            <RadioGroup
              label="Choose Tm Type:"
              options={[
                { value: "default", label: "Default Tm" },
                { value: "neb_tm", label: "NEB Tm" }
              ]}
              onChange={(e) => setTmType(e.target.value)}
              selectedValue={tmType}
            ></RadioGroup>
            {hasWarning && (
              <div>
                <Icon
                  style={{ marginLeft: 5, marginRight: 5 }}
                  size={10}
                  icon="warning-sign"
                ></Icon>
                {hasWarning}
                <br></br>
                <br></br>
                Try using the Default Tm
              </div>
            )}
          </div>
        }
      >
        <React.Fragment>
          <InnerWrapper>Melting Temp: {Number(tm) || 0} </InnerWrapper>
          {hasWarning && (
            <Icon
              style={{ marginLeft: 5, marginRight: 5 }}
              size={10}
              icon="warning-sign"
            ></Icon>
          )}
        </React.Fragment>
      </Popover>
    </WrapperToUse>
  );
}

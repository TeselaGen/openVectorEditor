import { Button } from "@blueprintjs/core";
import React from "react";
import { primersSubmenu } from "../../MenuBar/viewSubmenu";

import genericAnnotationProperties from "./GenericAnnotationProperties";
export default genericAnnotationProperties({
  annotationType: "primer",
  noColor: true,
  visSubmenu: primersSubmenu,
  noType: true,
  withBases: true,
  additionalFooterEls: (props) => {
    return (
      <Button onClick={props.createNewPCR} intent="success">
        Simulate PCR
      </Button>
    );
  }
});

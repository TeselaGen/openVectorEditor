import React from 'react'
import { Switch } from '@blueprintjs/core';
import { InfoHelper } from 'teselagen-react-components';

export default function renderToggle({ that, type, label, description, hook }) {
  const toggleEl = (
    <Switch
      data-test={type}
      checked={that.state[type]}
      label={label ? <span>{label}</span> : type}
      style={{ margin: "0px 30px", marginTop: 4 }}
      onChange={() => {
        hook && hook(!that.state[type]);
        that.setState({
          [type]: !that.state[type]
        });
      }}
    />
  );
  return (
    <div style={{display: 'flex'}} className={"toggle-button-holder"}>
      {description && <InfoHelper style={{marginRight: -15, marginTop: 5, marginLeft: 5}}>{description}</InfoHelper>}
      {toggleEl}
    </div>
  );
}

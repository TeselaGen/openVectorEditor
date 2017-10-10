import {Icon, Checkbox} from '@blueprintjs/core';
import React from "react";
import {map, startCase} from 'lodash';

export default ({readOnly, toggleDropdown, isOpen}) => {

  return {
    Icon: <Icon iconName={"eye-open"}></Icon>,
    onIconClick: toggleDropdown,
    Dropdown: VisibilityOptions,
    noDropdownIcon: true,
    toggled: isOpen,
    tooltip: !readOnly ? "Hide Visibility Options" : "Show Visibility Options",
    id: "editMode"
  }
};


function VisibilityOptions({annotationVisibility, annotationVisibilityToggle, annotationLabelVisibility, annotationLabelVisibilityToggle}) {
  return <div>
    <h6>View:</h6>
    {map(annotationVisibility, (visible, annotationName) => {
       return <div key={annotationName}>
         <Checkbox onChange={() => {
           annotationVisibilityToggle(annotationName)
         }} checked={visible} label={startCase(annotationName)}></Checkbox>
       </div>
     })}
     <h6>View Labels:</h6>
    {map(annotationLabelVisibility, (visible, annotationName) => {
       return <div key={annotationName}>
         <Checkbox onChange={() => {
           annotationLabelVisibilityToggle(annotationName)
         }} checked={visible} label={startCase(annotationName)}></Checkbox>
       </div>
     })}
  </div>
}


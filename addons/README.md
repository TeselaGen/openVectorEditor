# Addons

Addons are modules that can easily be added to OVE to perform specific functionality without expanding the core codebase. 

They can rely on code from the OVE core codebase but not vice-versa

If a node_module has already been used in the main OVE codebase, it should be referenced via a varaiable attached to window.addOnGlobals

For example: 
```
const { shortid } = window.addonGlobals
```

It will also need to be added to the open-vector-editor/src/addOnGlobals.js file if it hasn't already been. 

This allows us to keep the UMD build small by sharing modules that have already been loaded.



# UMD usage: 
pass: 
window.createVectorEditor(yourDomNodeHere, {
  autoAnnotateFeatures: window._ove_addons.autoAnnotateFeatures,
  autoAnnotateParts: window._ove_addons.autoAnnotateParts,
  autoAnnotatePrimers: window._ove_addons.autoAnnotatePrimers,
});

# Usage:

```js
import {
  autoAnnotateFeatures,
  autoAnnotateParts,
  autoAnnotatePrimers
} from "ove-auto-annotate";

<Editor
  {...{ 
    autoAnnotateFeatures, 
    autoAnnotateParts, 
    autoAnnotatePrimers, 
    getCustomAutoAnnotateList, //(optional) see below for more details 
    ...etc 
  }}
/>;
```

# UMD usage:
include the following script after the main OVE script tag

```html
<script
  type="text/javascript"
  src="https://unpkg.com/ove-auto-annotate/umd/ove-auto-annotate.js"
></script>
```

and pass:

```js
window.createVectorEditor(yourDomNodeHere, {
  
  autoAnnotateFeatures: window._ove_addons.autoAnnotateFeatures,
  autoAnnotateParts: window._ove_addons.autoAnnotateParts,
  autoAnnotatePrimers: window._ove_addons.autoAnnotatePrimers,
  getCustomAutoAnnotateList //(optional) see below for more details
  ...etc
});
```

# Passing a custom list of existing annotations to choose from: 

```js
async function getCustomAutoAnnotateList ({ annotationType, sequenceData }) { //annotationType = feature|part|oligo
    const dataToReturn = await fetch("/my/endpoint/here", { ...someParams }); //hit your endpoint here

    return {
      title: `My ${pluralize(startCase(annotationType))}`, //optionally choose a title for the tab
      list: [ //return a list of annotations. id, sequence, name are all required. type and isRegex are optional. IUPAC substitutions are allowed in non isRegex annotations
        {
          name: "I cover the full Seq",
          sequence: sequenceData.sequence,
          id: "1"
        },
        { name: "trypto", type: "cds", sequence: "agagagagagaga", id: "9" },
        { name: "prom2", type: "promoter", sequence: "gcttctctctc", id: "10" },
        {
          name: "prom2",
          type: "promoter",
          sequence: "gctt.*ctctctc",
          isRegex: true,
          id: "11"
        }
      ]
    };
  };
```

# Publishing
- make sure you're not importing anything you shouldn't be! 
- commit/publish your changes at the top level
- cd addons/AutoAnnotate/
- publish (pubpatch|pubmajor|pubminor)


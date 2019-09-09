# Upgrade instructions for Major and Minor versions
Not every minor version will be documented here, only ones where user configuration is necessary to implement the feature. 
## v1.1.1
- adding a general properties tab
access it by adding "general" to the propertiesList
```
propertiesList: [
			"general",
			"features",
			"parts",
			"primers",
			"translations",
			"cutsites",
			"orfs",
			"genbank"
		]
```

 ## v1.0 
- panelsShown api changed: 
(only necessary if you don't want the defaults)
### Before:
```
panelsShown: {
  sequence: true,
  rail: false,
  circular: true
}
```
### After: 
```
panelsShown: [
    [
      {
        id: "sequence",
        name: "Sequence Map",
        active: true
      }
    ],
    [
      {
        id: "circular",
        name: "Circular Map",
        active: true
      },
      {
        id: "rail",
        name: "Linear Map",
        active: false
      },
      {
        id: "properties",
        name: "Properties",
        active: false
      }
    ]
  ],
```


## v0.5.10
- Added onPaste option (used like onCopy): 
```
onPaste: function(event, editorState) {
		//the onPaste here must return sequenceData in the teselagen data format
		const clipboardData = event.clipboardData;
		let jsonData = clipboardData.getData("application/json")
		if (jsonData) {
			jsonData = JSON.parse(jsonData)
			if (jsonData.isJbeiSeq) {
				jsonData = convertJbeiToTeselagen(jsonData)
			}
		}
		const sequenceData = jsonData || {sequence: clipboardData.getData("text/plain")}
		return sequenceData
	},
  ```
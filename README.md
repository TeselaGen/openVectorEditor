
Congrats, you've made it to the repo for Teselagen's Open Source Vector Editor Component 
 - Built With React & Redux
 - Built for easy extensibility + embed-ibility 

Issue Tracking Board: https://waffle.io/TeselaGen/openVectorEditor 

Demo: http://teselagen.github.io/openVectorEditor/ 

Table of Contents
<!-- TOC -->

- [Upgrade Instructions for Major and Minor Versions](#upgrade-instructions-for-major-and-minor-versions)
- [Universal Build](#universal-build)
  - [Universal Installation](#universal-installation)
  - [Universal Usage:](#universal-usage)
- [React Version](#react-version)
  - [Installation](#installation)
- [Data Model](#data-model)
- [Development:](#development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation-1)

<!-- /TOC -->


# Upgrade Instructions for Major and Minor Versions
This repo follows semantic versioning (major/minor/patche)

The commit log can be seen here:
https://github.com/TeselaGen/openVectorEditor/commits/master 

Upgrade instructions for any major or minor change can be found here:
[Upgrade instructions](UPGRADE_INSTRUCTIONS.md)

# Universal Build
The universal build can be used in any app, where as the react build should be used if using react because it allows for more flexibility

Universal Demo: http://teselagen.github.io/openVectorEditor/
## Universal Installation
via npm: 
```
npm install open-vector-editor
```
then add the links
```html
<link rel="stylesheet" type="text/css" href="your-path-to-node-modules/open-vector-editor/umd/main.css">
<script type="text/javascript" src="your-path-to-node-modules/open-vector-editor/umd/open-vector-editor.js"></script>
```

Or via CDN: 
```html
<link rel="stylesheet" type="text/css" href="https://unpkg.com/open-vector-editor/umd/main.css"> 
<script type="text/javascript" src="https://unpkg.com/open-vector-editor/umd/open-vector-editor.js"></script>
```

## Universal Usage: 
```html
<script>
const editor = window.createVectorEditor(yourDomNodeHere, {
	
	onSave: function(event, copiedSequenceData, editorState) {
          console.log("event:", event);
          console.log("sequenceData:", copiedSequenceData);
          console.log("editorState:", editorState);
        },
	onCopy: function(event, copiedSequenceData, editorState) {
		//the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
		console.log("event:", event);
		console.log("sequenceData:", copiedSequenceData);
		console.log("editorState:", editorState);
		const clipboardData = event.clipboardData;
		clipboardData.setData("text/plain", copiedSequenceData.sequence);
		clipboardData.setData(
			"application/json",
			JSON.stringify(copiedSequenceData)
		);
		event.preventDefault();
		//in onPaste in your app you can do:
		// e.clipboardData.getData('application/json')
	},
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
	rightClickOverrides: {
		selectionLayerRightClicked: (items, {annotation}, props) => {
			return [...items, { 
				//props here get passed directly to blueprintjs MenuItems
				text: "Create Part",
				onClick: () => console.log('hey!≈')
			}]
		}
	},
	PropertiesProps: {
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
	},
	ToolBarProps: {
			//name the tools you want to see in the toolbar in the order you want to see them
			toolList: [
				"saveTool",
				"downloadTool",
				"importTool",
				"undoTool",
				"redoTool",
				"cutsiteTool",
				"featureTool",
				"oligoTool",
				"orfTool",
				"viewTool",
				"editTool",
				"findTool",
				"visibilityTool",
				"propertiesTool",
			]
		},
		onDigestSave: () => {} //tnr: NOT YET IMPLEMENTED
});
editor.updateEditor({
	//note, sequence data passed here will be coerced to fit the Teselagen data model
	sequenceData: { Open Vector Editor data model
		sequence: "atagatagagaggcccg",
		features: [
			{
				start: 0, //start and end are 0-based inclusive for all annotations
				end: 10,
				id: 'yourUniqueID',
				forward: true //strand
			}
		],
		parts: []
	},
	annotationVisibility: {
		features: false
	},
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
				name: "Plasmid",
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
	caretPosition: 10,
	...additional editor props can be passed here [Example Editor State](./editorStateExample.js)
});	
</script>
```


# React Version
## Installation
```
yarn add install-peerdeps open-vector-editor
```
Add peer-dependencies: 
```
install-peerdeps open-vector-editor --dev --only-peers
```

#Data Model 
The data model can be interactively inspected by installing the redux devtools for your browser: [devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
Here is the top level editor state:
[Example Editor State](./editorStateExample.js)



#Development: 
## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation
```
yarn
yarn start
```


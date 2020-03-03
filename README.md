
Congrats, you've made it to the repo for Teselagen's Open Source Vector Editor Component 
 - Built With React & Redux
 - Built for easy extensibility + embed-ibility
 - Customize the views to suit your needs
 
 ![image](https://user-images.githubusercontent.com/2730609/62503453-220acd00-b7a9-11e9-87f3-19e3b1119e6e.png)


## Issue Tracking Board: https://github.com/orgs/TeselaGen/projects/10

## Demo: http://teselagen.github.io/openVectorEditor/ 

## Get the desktop app: https://github.com/tnrich/ove-electron/releases

## Cypress Tests Dashboard: https://dashboard.cypress.io/#/projects/1zj5vc/runs (you'll need to make a login with cypress)

## OVE out in the wild: 
 - https://j5.jbei.org/VectorEditor/VectorEditor.html

# Table of Contents
<!-- TOC -->

  - [Issue Tracking Board: https://github.com/orgs/TeselaGen/projects/10](#issue-tracking-board-httpsgithubcomorgsteselagenprojects10)
  - [Demo: http://teselagen.github.io/openVectorEditor/](#demo-httpteselagengithubioopenvectoreditor)
  - [Get the desktop app: https://github.com/tnrich/ove-electron/releases](#get-the-desktop-app-httpsgithubcomtnrichove-electronreleases)
  - [Cypress Tests Dashboard: https://dashboard.cypress.io/#/projects/1zj5vc/runs (you'll need to make a login with cypress)](#cypress-tests-dashboard-httpsdashboardcypressioprojects1zj5vcruns-youll-need-to-make-a-login-with-cypress)
  - [OVE out in the wild:](#ove-out-in-the-wild)
- [Table of Contents](#table-of-contents)
- [Upgrade Instructions for Major and Minor Versions](#upgrade-instructions-for-major-and-minor-versions)
- [Using this module in React](#using-this-module-in-react)
  - [Installation (react)](#installation-react)
  - [Code (react)](#code-react)
    - [Editor](#editor)
    - [CircularView/CircularViewUnconnected](#circularviewcircularviewunconnected)
    - [LinearView/LinearViewUnconnected](#linearviewlinearviewunconnected)
    - [RowView/RowViewUnconnected](#rowviewrowviewunconnected)
    - [EnzymeViewer](#enzymeviewer)
- [Using this module outside of react apps (Universal):](#using-this-module-outside-of-react-apps-universal)
  - [Installation (Universal)](#installation-universal)
    - [via npm:](#via-npm)
    - [Or via CDN:](#or-via-cdn)
  - [Code (Universal)](#code-universal)
    - [Accessing the editor state:](#accessing-the-editor-state)
  - [Demo (Universal): http://teselagen.github.io/openVectorEditor/](#demo-universal-httpteselagengithubioopenvectoreditor)
- [editorProps](#editorprops)
- [editorState](#editorstate)
- [Data Model](#data-model)
  - [Feature Locations (aka Feature Joins)](#feature-locations-aka-feature-joins)
- [Protein Editor](#protein-editor)
- [Alignments](#alignments)
  - [Integrating your own alignment data (only necessary if not using the built in alignment creation tool)](#integrating-your-own-alignment-data-only-necessary-if-not-using-the-built-in-alignment-creation-tool)
    - [Accessing the alignment state:](#accessing-the-alignment-state)
  - [Alignment Track Data Model](#alignment-track-data-model)
    - [Chromatogram Data](#chromatogram-data)
- [VersionHistoryView](#versionhistoryview)
  - [Flavors of use (aka Embedded in the Editor vs Standalone and UMD vs React):](#flavors-of-use-aka-embedded-in-the-editor-vs-standalone-and-umd-vs-react)
  - [API:](#api)
      - [getSequenceAtVersion](#getsequenceatversion)
      - [getVersionList](#getversionlist)
      - [onSave [optional] (not necessary unless using the standalone VersionHistoryView)](#onsave-optional-not-necessary-unless-using-the-standalone-versionhistoryview)
      - [exitVersionHistoryView [optional] (not necessary unless using the standalone VersionHistoryView)](#exitversionhistoryview-optional-not-necessary-unless-using-the-standalone-versionhistoryview)
      - [getCurrentSequenceData [optional] (not necessary unless using the standalone VersionHistoryView)](#getcurrentsequencedata-optional-not-necessary-unless-using-the-standalone-versionhistoryview)
- [Implementing Autosave functionality](#implementing-autosave-functionality)
- [Development:](#development)
  - [Prerequisites](#prerequisites)
  - [Outside Developer Set Up Steps](#outside-developer-set-up-steps)
  - [(advanced) Working with locally linked modules](#advanced-working-with-locally-linked-modules)

<!-- /TOC -->


# Upgrade Instructions for Major and Minor Versions
This repo follows semantic versioning (major/minor/patche)

The commit log can be seen here:
https://github.com/TeselaGen/openVectorEditor/commits/master 

Upgrade instructions for any major or minor change can be found here:
[Upgrade instructions](UPGRADE_INSTRUCTIONS.md)

# Using this module in React
## Installation (react)
```
yarn add install-peerdeps open-vector-editor
```
Add peer-dependencies: 
```
install-peerdeps open-vector-editor --dev --only-peers
```

## Code (react)
Require the following components like: 
```
import {Editor, RowView} from "open-vector-editor
```
### Editor
The `<Editor {...editorProps}/>` component gives you a full blown editor.
It takes in a list of editorProps as detailed below. 
### CircularView/CircularViewUnconnected
This gives you just the circular/plasmid map view. Either redux connected or unconnected (non-interactive)
### LinearView/LinearViewUnconnected
This gives you just the linear map view. Either redux connected or unconnected (non-interactive)
### RowView/RowViewUnconnected
This gives you just the detailed view of the sequence rows. Either redux connected or unconnected (non-interactive)
### EnzymeViewer
A component used for viewing enzymes 


# Using this module outside of react apps (Universal): 
The universal build can be used in any app with or without react. It corresponds to using the <Editor/> component in the React version. You will be able to customize the Editor just like in the react build, but you will not be able to use the individual components like <CircularView/> or <EnzymeViewer/>. For that you'll need to use React.
## Installation (Universal)
### via npm: 
```
npm install open-vector-editor
```
then add the links
```html
<link rel="stylesheet" type="text/css" href="your-path-to-node-modules/open-vector-editor/umd/main.css">
<script type="text/javascript" src="your-path-to-node-modules/open-vector-editor/umd/open-vector-editor.js"></script>
```

### Or via CDN: 
```html
<link rel="stylesheet" type="text/css" href="https://unpkg.com/open-vector-editor/umd/main.css"> 
<script type="text/javascript" src="https://unpkg.com/open-vector-editor/umd/open-vector-editor.js"></script>
```

## Code (Universal)

```html
<script>
const editor = window.createVectorEditor(yourDomNodeHere || "createDomNodeForMe", editorProps); /* createDomNodeForMe will make a dom node for you and append it to the document.body*/
editor.updateEditor(editorState);	
</script>
```

### Accessing the editor state: 
```js
const currentEditorState = editor.getState()
//you can view various properties of the alignment such as the selection layer using alignment.getState()
console.info(currentEditorState.selectionLayer)
```

## Demo (Universal): http://teselagen.github.io/openVectorEditor/

# editorProps
These props consist of hooks and editor config options that can be passed like so: `<Editor {...editorProps}/>`  or as seen above like `window.createVectorEditor(yourDomNodeHere, editorProps);`
```js
{
	shouldAutosave: true, //by default the editor does not autosave, setting this to true will trigger the onSave callback after any change to the sequenceData
	//supplying this function WILL make the editor FULLSCREEN BY DEFAULT
	handleFullscreenClose: () => { 
		//do whatever you want here
		//UMD only:
		editor.close() //this calls reactDom.unmountComponent at the node you passed as the first arg
	},
	showReadOnly: false, //default true
  disableSetReadOnly: true, //default false
	onSave: function(event, sequenceDataToSave, editorState, onSuccessCallback) {
		console.info("event:", event);
		console.info("sequenceData:", sequenceDataToSave);
		console.info("editorState:", editorState);
		// To disable the save button after successful saving
		// either call the onSuccessCallback or return a successful promise :)
		onSuccessCallback()
		//or 
		// return myPromiseBasedApiCall()
	},
	onCopy: function(event, copiedSequenceData, editorState) {
		//the copiedSequenceData is the subset of the sequence that has been copied in the teselagen sequence format
		console.info("event:", event);
		console.info("sequenceData:", copiedSequenceData);
		console.info("editorState:", editorState);
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
	//regular click overrides, eg: 
	featureClicked: ({annotation, event}) => {
		//do something here :)
	}
	// orf/primer/translation/cutsite/translationDouble/deletionLayer/replacementLayer/feature/part/searchLayer xxxxClicked can also be overridden

	rightClickOverrides: { //override what happens when a given feature/part/primer/translation/orf/cutsite/selectionLayer/lineageLine gets right clicked
		//the general format is xxxxRightClicked eg:
		selectionLayerRightClicked: (items, {annotation}, props) => {
			return [...items, { 
				//props here get passed directly to blueprintjs MenuItems
				text: "Create Part",
				onClick: () => console.info('hey!≈')
			}]
		}
	},
	PropertiesProps: { 
		// the list of tabs shown in the Properties panel
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
			toolList: [
				"saveTool",
				//you can override a tool like so:
				{name: "downloadTool", Dropdown: () => { 
					return "Hey!"
				}},
				"importTool",
				"undoTool",
				"redoTool",
				"cutsiteTool",
				"featureTool",
				"alignmentTool",
				// "oligoTool",
				"orfTool",
				// "viewTool",
				"editTool",
				"findTool",
				"visibilityTool"
				// "propertiesTool"
			]
		}
		StatusBarProps: {
			//these are the defaults:
			showCircularity: true,
  		showReadOnly: true,
			showAvailability: false
		},
		onDigestSave: () => {} //tnr: NOT YET IMPLEMENTED
}
```
# editorState
These are the options to the `updateEditor()` action (the most generic redux action we have)) and will cause the editor state stored in redux to be updated. Only the subset of options that are passed will be updated. 
```js
{

	//note, sequence data passed here will be coerced to fit the Teselagen data model (Teselagen JSON)
	sequenceData: { Open Vector Editor data model
		sequence: "atagatagagaggcccg",
		features: [
			{
				color: "#b3b3b3", //you can override the default color for each individual feature if you want
				type: "misc_feature",
				start: 0, //start and end are 0-based inclusive for all annotations
				end: 10,
				id: 'yourUniqueID',
				forward: true //ie true=positive strand     false=negative strange 
			}
		],
		parts: []
	},
	sequenceDataHistory: {}, //clear the sequenceDataHistory if there is any left over from a previous sequence
	sequenceDataHistory: {}, //clear the sequenceDataHistory if there is any left over from a previous sequence
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
	caretPosition: 10,
	...additional editor props can be passed here [Example Editor State](./editorStateExample.js)
}
```

# Data Model 
The data model can be interactively inspected by installing the redux devtools for your browser: [devtools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
Here is the top level editor state:
[Example Editor State](./editorStateExample.js)
## Feature Locations (aka Feature Joins)
Features can have multiple internal locations. You can see an example of a joined feature in the ./editorStateExample.js file linked above. 
They look like this: 
```js
{
	name: "GFP_with_locations"
	start: 10,
	end: 40,
	locations: [{
		start: 10, //this must match the .start property of the feature,
		end: 15
	}, 
	{
		start: 18, end: 19
	},
	{
		start: 35,
		end: 40 //this must match the .end property of the feature,
	}
	]
}
```

# Protein Editor
OVE can be set up to view and edit proteins (Amino Acid sequences) as first class citizens. 
The protein editor can be seen here: http://teselagen.github.io/openVectorEditor/#/Editor?isProtein=true 

The editor supports Amino Acid sequences as well as DNA sequences!
Protein sequence mode is enabled by calling updateEditor with a protein sequenceData object: 
```js
updateEditor(store, "DemoEditor", {
  sequenceData: tidyUpSequenceData(exampleProteinData, {
    convertAnnotationsFromAAIndices: true
  })
})
```
the protein sequenceData object should look like so
```js
{
	isProtein: true
	//either or both .proteinSequence (aa string) or .sequence (dna string) must be provided if isProtein: true
	//if only .sequence is provided, OVE will automatically compute the amino acids from the provided dna sequence
	//if only .proteinSequence is provided, OVE will automatically compute the degenerate DNA sequence from the provided aa string
	//if both .proteinSequence and .sequence are provided, then OVE will assume that the underlying 
	//dna sequence maps to the provided aa string as long as sequence.length === 3 * proteinSequence.length
	proteinSequence: "mmhlrlfcillaavs...etc"
	sequence: "gtagagagagcca...etc" //optional!
	//if features or parts are provided to the editor, it is assumed that they will indexed to the underlying DNA sequence (0-based inclusive) , not to the AA indices . 
	//You can use the helper util from ve-sequence-utils tidyUpSequenceData to convertAnnotationsFromAAIndices if your protein data has 
	//features/parts coming in as AA-indexed
	features: [{name: "testFeature1", 
		start: 3, //start on AA 1
		end: 5 //end on AA 1 
	}],
	parts: [{
		name: "myFakePart"
		start: 0, //start on AA 0
		end: 11 //end on AA 3 
	}]
}
```

The usual onSave, onCopy, onCut handlers will now come back with a .proteinSequence field. 
You'll need to save/manipulate the protein sequence data however you do for dna sequences.

certain dna specific tools and annotations are automatically disabled when isProtein=true :
 - primers
 - orfs
 - translations 
 - cutsites
 - sequence digestions 
 - ...etc


# Alignments


## Integrating your own alignment data (only necessary if not using the built in alignment creation tool)

Add a panel to the panelsShown prop like so: 

```js
const alignment = window.createAlignmentView(this.node, {
	id: "jbeiAlignment1", //give your alignment a unique id
	////optional! Use if you want a pairwise alignment:
	pairwiseAlignments: [  // this is an array of [referenceSequence, alignedSequence]
		[
			{ //reference sequence must come first!
				sequenceData: {
					id: "FWER1231", //every sequenceData and alignmentData should have a unique id
					name: "GFPuv58",
					sequence:	"ttgagggg",
					features: [{id: "feat1", start: 2, end:4, name: "GFP CDS"}]
				},
				alignmentData: {
					sequence:	"ttgag--ggg--" //this length should be the same as the below alignmentData length!
				}
			},{ //aligned sequence must come second!
				sequenceData: {
					name: "GFPuv58",
					sequence:	"gagccgggtt"
				},
				alignmentData: {
					sequence:	"--gagccgggtt" //this length should be the same as the above alignmentData length!
				}
			}
		]
		[
			{Alignment Track Data Here}, //reference sequence track (see Data Model below for specs)
			{Alignment Track Data Here}, //aligned sequence track (see Data Model below for specs)
		],
		[
			{Alignment Track Data Here}, //see Data Model below for specs
			{Alignment Track Data Here}, 
		],
	]
	////optional! Use if you want a multi-seq alignment:
	alignmentTracks: [ 
		{Alignment Track Data Here}, //see Data Model below for specs
		{Alignment Track Data Here},
		{Alignment Track Data Here},
	],
	//additional view options: 

	"alignmentAnnotationVisibility": {
        "features": true,
        "translations": false,
        "parts": true,
        "orfs": true,
        "orfTranslations": false,
        "axis": true,
        "cutsites": false,
        "primers": true,
        "reverseSequence": false,
        "axisNumbers": true
    },
    "alignmentAnnotationLabelVisibility": {
        "features": true,
        "parts": true,
        "cutsites": false
    },
});

```
### Accessing the alignment state: 

```js
const currentAlignmentState = alignment.getState()
//you can view various properties of the alignment such as the selection layer using alignment.getState()
console.info(currentAlignmentState.selectionLayer)
```


## Alignment Track Data Model
Note: `alignmentData.sequence` is assumed to be the same length for EVERY track within an alignment run or a pairwise alignment sub-alignment!

`alignmentData` can contain "-" characters, whereas sequenceData should not. Sequence Data is the "raw" data of the sequence being aligned with features/parts/etc. 

```js
{
	//JBEI sequence 'GFPuv58'
	// chromatogramData: ab1ParsedGFPuv58,
	sequenceData: {
		id: "2",
		name: "GFPuv58",
		sequence:
			"GTTCAATGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATCGTATCGAGTT"
	},
	alignmentData: {
		id: "2",
		sequence:
			"GTTCAA--TGCTTTTCCCGTTATCCGGATCATATGAAACGGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACA---GGAACGCACTATATCTTTCAAAGATGACGGGAACTACAAGACGCGTGCTGAAGTCAAGTTTGAAGGTGATAC--CCTTGTTAATCGTATCGAGTT--"
	}
}
```

### Chromatogram Data 
```
"chromatogramData": { //only if parsing in an ab1 file
      "aTrace": [], //same as cTrace but for a
      "tTrace": [], //same as cTrace but for t
      "gTrace": [], //same as cTrace but for g
      "cTrace": [0,0,0,1,3,5,11,24,56,68,54,30,21,3,1,4,1,0,0, ...etc], //heights of the curve spaced 1 per x position (aka if the cTrace.length === 1000, then the max basePos can be is 1000)
      "basePos": [33, 46, 55,], //x position of the bases (can be unevenly spaced)
      "baseCalls": ["A","T", ...etc],
      "qualNums": [],
    },
```

# VersionHistoryView
## Flavors of use (aka Embedded in the Editor vs Standalone and UMD vs React): 

Can be used on its own (must pass additional props): 
```js
<VersionHistoryView {...{getSequenceAtVersion, getVersionList, onSave, exitVersionHistoryView, getCurrentSequenceData}}/>
//or as a UMD module:
window.createVersionHistoryView({getSequenceAtVersion, getVersionList, onSave, exitVersionHistoryView, getCurrentSequenceData})
```

or as part of the Editor/createVectorEditor
```js
<Editor {...{getSequenceAtVersion, getVersionList, onSave, ToolBarProps: {toolList: ["versionHistoryTool", ...otherTools]}}}/> 
//or as a UMD module:
window.createVectorEditor({getSequenceAtVersion, getVersionList, onSave, ToolBarProps: {toolList: ["versionHistoryTool", ...otherTools]}})
```


## API:
#### getSequenceAtVersion 
 `(versionId) => teselagenSequenceData`
#### getVersionList
 `() => [{ versionId: "51241", dateChanged: "12/30/1990", editedBy: "Hector Plahar", revisionType: "Feature Add"}]`
#### onSave [optional] (not necessary unless using the standalone VersionHistoryView)
 `(event, sequenceDataToSave, editorState, onSuccessCallback) => { same onSave handler as normal } `
#### exitVersionHistoryView [optional] (not necessary unless using the standalone VersionHistoryView)
 `() => {}  `
#### getCurrentSequenceData [optional] (not necessary unless using the standalone VersionHistoryView)
 `() => teselagenSequenceData  //called upon initialization  `


<!-- 
# Implementing Autosave functionality
 -->

# Development: 

## Prerequisites
[Node.js](http://nodejs.org/) >= v8 must be installed.
download the latest yarn (https://yarnpkg.com/en/)

## Outside Developer Set Up Steps

```
IMPORTANT! First make sure you make an issue for whatever it is you'd like to see changed! 
fork your own branch of openVectorEditor from https://github.com/TeselaGen/openVectorEditor
cd openVectorEditor
yarn
yarn start
navigate to http://localhost:3344/ once the demo app has built
modify the openVectorEditor code base to fix/build whatever it is you're trying to do
set up a demo for your fix/feature if applicable in demo/src/EditorDemo/index.js
set up a cypress test for your fix/feature if applicable 
you can run the cypress dev tool by running `yarn c` and see your tests
you can view existing cypress tests in the cypress/integration folder
you can either add your test to an existing cypress file or make a new test file

once you're satisfied, make a pull request back to openVectorEditor and mention @tnrich
```



## (advanced) Working with locally linked modules 
Sometimes it can be helpful to debug certain npm modules locally. 
You can always edit their es5 compiled code within the node_modules folder itself,
but sometimes it's useful to debug their source code directly. Luckily we can do 
this using webpack aliases. Here's how:
```
open ./nwb.config.js 
comment in whatever module you want to have linked locally (ve-range-utils, ve-sequence-utils, bio-parsers, teselagen-react-components)
you'll need to have that module cloned down from github on your machine's file system for this to work
```



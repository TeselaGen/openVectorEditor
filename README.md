
Congrats, you've made it to the repo for Teselagen's Open Source Vector Editor Component 
 - Built With React & Redux
 - Built for easy extensibility + embed-ibility 

Issue Tracking Board: https://waffle.io/TeselaGen/openVectorEditor 

Demo: http://teselagen.github.io/openVectorEditor/ 

Table of Contents
<!-- TOC -->

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
	onSave: function(event, sequenceData, editorState) {
		console.log("event:", event);
		console.log("sequenceData:", sequenceData);
		console.log("editorState:", editorState);
	},
	onCopy: function(event, sequenceData, editorState) {
		onSave: function(event, copiedSequenceData, editorState) {
			console.log("event:", event);
			console.log("sequenceData:", copiedSequenceData);
			console.log("editorState:", editorState);
		},
		onCopy: function(event, copiedSequenceData, editorState) {
			console.log("event:", event);
			console.log("sequenceData:", copiedSequenceData);
			console.log("editorState:", editorState);
			const clipboardData  = event.clipboardData
			clipboardData.setData('text/plain', copiedSequenceData.sequence);
			clipboardData.setData('application/json', JSON.stringify(copiedSequenceData));
			event.preventDefault();
			//in onPaste in your app you can do: 
			// e.clipboardData.getData('application/json')
		}
	},
	PropertiesProps: {
		propertiesList: [
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
	panelsShown: {
		circular: false,
		sequence: true,
		rail: true,
	},
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


Redux connected: 

```js
//store.js
import {vectorEditorReducer as VectorEditor} from 'teselagen-react-components'
const store = createStore(
  combineReducers({
    VectorEditor: VectorEditor({
			DemoEditor: { //you can pass initial values here to the editor if you want or they can be passed at render time
				sequenceData: exampleSequenceData
			}
	})
  }),
  undefined,
  composeEnhancer(
  	  applyMiddleware(thunk) //your store should be redux-thunk enabled!
  	)
)


//file where you want to display the editor: 
import DemoEditor from '../DemoEditor';
var {withEditorInteractions, withEditorProps, veSelectors} = SelectInsertEditor
import {CircularView, LinearView, CutsiteFilter} from 'teselagen-react-components';

var CutsiteFilterConnected = withEditorProps(CutsiteFilter)
var CircularViewConnected = withEditorInteractions(CircularView)
var LinearViewConnected = withEditorInteractions(LinearView)


function actionOverrides(actions) {
	return {
		selectionLayerRightClicked(firstArg, ...otherArgs) {
			return actions.selectionLayerRightClicked(
				{
					...firstArg,
					extraItems: [
						{
							title: "Delete Selection",
							fn: onDeleteClick,
							disabled: deletionButtonDisabled
						},
						{
							title: "Replace Selection",
							fn: onReplaceClick,
							disabled: replaceDisabled
						}
					]
				},
				...otherArgs
			);
		}
	};
}

function MyReactComp () {
	var editorProps = { //
		actionOverrides: (restrictionDigest || alreadyLinearized) ? actionOverrides : undefined,
		disableEditorClickAndDrag: restrictionDigest || alreadyLinearized,
		annotationVisibility: { 
			//only show custites if the user is doing a restriction digest
			cutsites: restrictionDigest,
			orfs: false
		}
	}
	return <div>
		<LinearViewConnected 
		    //props passed here will take precedence over redux provided props
			{...editorProps}/>
		<CircularViewConnected
                {... {
                  ...editorProps,
                  scale: .8,
                  width: Math.max(containerWidth - 100, 200),
                  height: Math.max(containerWidth - 300, 200),
                  featureOptions: {
                    showFeatureLabels: restrictionDigest
                  },
                  // selectionLayer: [],
                  lineageLines
                  }
                }
                />
	</div>
}

//some file where you want to do things to the demo editor
import DemoEditor from '../DemoEditor';
var {veActions} = DemoEditor
//see all actions by console logging veActions

dispatch(veActions.updateSequenceData(sequenceData)) //dispatch an update action the sequence data for the demo editor
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


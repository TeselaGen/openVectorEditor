
<!-- TOC -->

- [Open Vector Editor](#open-vector-editor)
      - [Teselagen's Open Source Vector Editor Component](#teselagens-open-source-vector-editor-component)
- [Universal Build](#universal-build)
  - [Installation](#installation)
- [React Version](#react-version)
  - [Installation](#installation-1)
  - [Data Table](#data-table)
- [Development:](#development)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation-2)
  - [Demo Development Server](#demo-development-server)
  - [Developing linked to another folder: aka lims/hde](#developing-linked-to-another-folder-aka-limshde)
  - [Running Tests](#running-tests)
  - [Releasing](#releasing)
  - [Adding custom svg icons](#adding-custom-svg-icons)

<!-- /TOC -->
# Open Vector Editor
####Teselagen's Open Source Vector Editor Component 
 - Built With React & Redux
 - Built for easy extensibility + embed-ibility 
# Universal Build
The univeral build can be used in any app, where as the react build should be used if using react because it will allow for more flexibility
## Installation 
npm install open-vector-editor


The Universal build can be used as window.tg_editor



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

//DemoEditor.js
import {createVectorEditor} from 'teselagen-react-components'

export default createVectorEditor({
  editorName: 'DemoEditor', 
  //you can pass editor specific action overrides at this level or at render time
  // actionOverrides(actions) {
  //   return {
  //     featureClicked: function ({annotation}) {
  //       return actions.caretPositionUpdate(annotation.start)
  //     },
  //     selectionLayerUpdate: function (selectionLayer) {
  //       return actions.caretPositionUpdate(selectionLayer.start)
  //     }
  //   }
  // }
})

//file where you want to display the editor: 
import DemoEditor from '../DemoEditor';
var {withEditorInteractions, withEditorProps, veSelectors, HoverHelper} = SelectInsertEditor
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
                    // componentOverrides: restrictionDigest
                    //   ? {
                    //     SelectionLayer: SelectionLayerOverride,
                    //     Caret: CaretOverride,
                    //   }
                    //  : undefined
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

##Data Table
```js
import {DataTable, routeDoubleClick, queryParams} from "teselagen-react-components";
import {toastr} from 'teselagen-react-components';
import {
	InputField,
	SelectField,
	DateInputField,
	CheckboxField,
	TextareaField,
	EditableTextField,
	ReactSelectField,
	NumericInputField,
	RadioGroupField,
	FileUploadField
} from 'teselagen-react-components'

<InputField
  name={"fieldName"}
  label="fieldLabel"
  placeholder="Enter text..."
  inputClassName="className(s) for input"
/>

```
#Development: 
## Prerequisites

[Node.js](http://nodejs.org/) >= v4 must be installed.

## Installation

- Running `npm install` in the components's root directory will install everything you need for development.

## Demo Development Server

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading. You can check the /demo folder for the source code.

## Developing linked to another folder: aka lims/hde
```
//link everything up:
cd lims/node_modules/react
yarn link 
cd teselagen-react-components
yarn link
yarn link react
cd lims
yarn link teselagen-react-components

//start the auto rebuild:
cd teselagen-react-components
yarn build-watch
```

## Running Tests

- `npm test` will run the tests once.

- `npm run test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `npm run test:watch` will run the tests on every change.

## Releasing

- `npm whoami` you should be teselagen
- `npm login` 
teselagen//ourMasterPass//team@teselagen.com
- git pull
- npm version patch|minor|major
- npm publish
- git push


## Adding custom svg icons
 - `yarn fontopen` this opens up our custom font file in the fontello webtool
 - add the svg icons you want, hit **Save Session** to commit your changes
 - then run `yarn fontsave`
 - commit the changes :)
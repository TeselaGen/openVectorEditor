import {mount} from 'enzyme'
import React from 'react'
import {Editor, updateEditor} from '../src'
import HarnessComponent from './HarnessComponent'
import testStore from './testStore'
import exampleSequenceData from '../src/tg_createEditor/exampleSequenceData'


// updateEditor(testStore, 'testEditor', {
//   sequenceData: exampleSequenceData,
//   readOnly: false
// })


class WrappedEditor extends React.Component {
  componentWillMount
  render(){
    return <HarnessComponent>
      <Editor editorName={'testEditor'}></Editor>
    </HarnessComponent>
  }
}

describe('Editor', function() {
  const node = mount(
    <WrappedEditor></WrappedEditor>
  );
  debugger

})
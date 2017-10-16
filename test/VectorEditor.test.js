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


class Wrapper extends React.Component {
  render(){
    return <HarnessComponent>
      <Editor editorName={'testEditor'}></Editor>
    </HarnessComponent>
  }
}

describe('Editor', function() {
  it('renders with no data', function() {
    const node = mount(
      <Wrapper></Wrapper>
    );
    node.exists()
  })
})
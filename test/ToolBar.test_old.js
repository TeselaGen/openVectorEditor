import {mount} from 'enzyme'
import React from 'react'
import {ToolBar, ToolBarUnconnected, updateEditor} from '../src'
import HarnessComponent from './HarnessComponent'
import testStore from './testStore'
import exampleSequenceData from '../src/createVectorEditor/exampleSequenceData'

class Wrapper extends React.Component {
  render(){
    return <HarnessComponent>
      <ToolBar editorName={'testEditor'}></ToolBar>
    </HarnessComponent>
  }
}

describe.only('ToolBar', function() {
  it('renders with no data', function() {
    const node = mount(
      <Wrapper></Wrapper>
    );
    node.exists()
  })
  it('renders with data', function() {
    updateEditor(testStore, 'testEditor', {
      sequenceData: exampleSequenceData,
      readOnly: false
    })

    const node = mount(
      <Wrapper></Wrapper>
    );
    const subnode = node.find(ToolBarUnconnected)
    const p = subnode.props()
  })

})
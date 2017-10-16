import {mount} from 'enzyme'
import React from 'react'
import {VeToolBar, VeToolBarUnconnected, updateEditor} from '../src'
import HarnessComponent from './HarnessComponent'
import testStore from './testStore'
import exampleSequenceData from '../src/tg_createEditor/exampleSequenceData'

class Wrapper extends React.Component {
  render(){
    return <HarnessComponent>
      <VeToolBar editorName={'testEditor'}></VeToolBar>
    </HarnessComponent>
  }
}

describe.only('VeToolBar', function() {
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
    const subnode = node.find(VeToolBarUnconnected)
    const p = subnode.props()
  })

})
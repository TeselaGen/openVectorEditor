import {mount} from 'enzyme'
import React from 'react'
import {StatusBar, StatusBarUnconnected, updateEditor} from '../src'
import HarnessComponent from './HarnessComponent'
import testStore from './testStore'
import exampleSequenceData from '../src/tg_createEditor/exampleSequenceData'

class Wrapper extends React.Component {
  componentWillMount
  render(){
    return <HarnessComponent>
      <StatusBar editorName={'testEditor'}></StatusBar>
    </HarnessComponent>
  }
}

describe('StatusBar', function() {
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
    const subnode = node.find(StatusBarUnconnected)
    const p = subnode.props()
  })

})
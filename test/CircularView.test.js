import {mount} from 'enzyme'
import React from 'react'
import {CircularView, CircularViewUnconnected, updateEditor} from '../src'
import HarnessComponent from './HarnessComponent'
import testStore from './testStore'
import exampleSequenceData from '../src/tg_createEditor/exampleSequenceData'

class Wrapper extends React.Component {
  render(){
    return <HarnessComponent>
      <CircularView editorName={'testEditor'}></CircularView>
    </HarnessComponent>
  }
}

describe('CircularView', function() {
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
    const subnode = node.find(CircularViewUnconnected)
    const p = subnode.props()
    
  })

})
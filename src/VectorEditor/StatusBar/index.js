import getInsertBetweenVals from 've-sequence-utils/getInsertBetweenVals';
import getRangeLength from 've-range-utils/getRangeLength'
import React from 'react'
import './style.scss';

export default function StatusBar({selectionLayer, caretPosition, sequenceLength, readOnly, showReadOnly=true}) {
  var length = getRangeLength(selectionLayer, sequenceLength)
  var insertBetween = getInsertBetweenVals(caretPosition, selectionLayer, sequenceLength)
  var isSelecting = selectionLayer.start > -1
  return <div className={'veStatusBar'}>
    {
      showReadOnly && <StatusBarItem>
        {readOnly ? 'Editable' : 'Read Only'}
      </StatusBarItem>
    }
    <div className={'spacer'}/>
    {
      <StatusBarItem>
        {`Insert between bases ${insertBetween[0]} and ${insertBetween[1]}`}
      </StatusBarItem>
    }
    <div className={'spacer'}/>
    {
      <StatusBarItem>
        Selecting {isSelecting ? length : 0} bps from {isSelecting ? selectionLayer.start+1 : '-'} to {isSelecting ? selectionLayer.end+1 : '-'}
      </StatusBarItem>
    }
    <div className={'spacer'}/>
    {
      <StatusBarItem>
        Length: {sequenceLength}
      </StatusBarItem>
    }
  </div>  
}

function StatusBarItem({children}) {
    return <div className={'item'}>
      {children}
    </div>
}

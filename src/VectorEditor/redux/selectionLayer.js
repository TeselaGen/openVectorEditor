//./selectionLayer.js
import { createReducer } from 'redux-act'
import createAction from './utils/createMetaAction'


// ------------------------------------
// Actions
// ------------------------------------
export const selectionLayerClear = createAction('selectionLayerClear')
export const selectionLayerUpdate = createAction('selectionLayerUpdate')

var { caretPositionUpdate } = require('./caretPosition'); //important, keep this here in the order of the file and let it use the commonjs syntax! 
// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [caretPositionUpdate]: () => {
    //clear the selection layer if the caret is updated!
    return {
      start: -1,
      end: -1
    }
  },
  [selectionLayerClear]: () => {
    return {
      start: -1,
      end: -1
    }
  },
  [selectionLayerUpdate]: (state, newSelectionLayer) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!(newSelectionLayer.start >= 0 && newSelectionLayer.end >= 0)) {
        console.error('we should never be here! selectionLayerUpdate must always be called with a valid selection layer')
        debugger
      }
    }
    return newSelectionLayer
  },
}, {
  start: -1,
  end: -1
})

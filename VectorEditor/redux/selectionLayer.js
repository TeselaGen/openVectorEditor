
//./selectionLayer.js
import { createReducer } from 'redux-act'
import createAction from './utils/createNamespacedAction'


// ------------------------------------
// Actions
// ------------------------------------
export const clearSelectionLayer = createAction('clearSelectionLayer')
export const updateSelectionLayer = createAction('updateSelectionLayer')

var { updateCaret } = require('./caretPosition'); //important, keep this here in the order of the file and let it use the commonjs syntax! 
// ------------------------------------
// Reducer
// ------------------------------------
export default createReducer({
  [updateCaret]: () => {
    //clear the selection layer if the caret is updated!
    return {
      start: -1,
      end: -1
    }
  },
  [clearSelectionLayer]: () => {
    return {
      start: -1,
      end: -1
    }
  },
  [updateSelectionLayer]: (state, newSelectionLayer) => {
    if (process.env.NODE_ENV !== 'production') {
      if (!(newSelectionLayer.start >= 0 && newSelectionLayer.end >= 0)) {
        console.error('we should never be here! updateSelectionLayer must always be called with a valid selection layer')
        debugger
      }
    }
    return newSelectionLayer
  },
}, {
  start: -1,
  end: -1
})


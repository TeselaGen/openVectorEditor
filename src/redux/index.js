import { routeReducer as router } from 'redux-simple-router'
import {reducer as form} from 'redux-form'
import {reducer as VectorEditor} from '../../VectorEditor';
import combineReducers from 'redux/lib/combineReducers';

export default function (state, action) {
  // //console.log('state: ', state);
  // //console.log('action: ', action);
  if (action.type === 'RESET_STATE') {
    //reset the state by returning underfined here
    return undefined;
  }
  else {
    return combineReducers({
      form,
      router,
      VectorEditor,
      // yakyakyak: function (state, action) {
      //   if (action.type==='@@INIT') {
      //   }
      //   return 'hey'
      // }
    })(state,action)
  }
}

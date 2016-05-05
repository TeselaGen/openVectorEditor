import sequenceDataSelector from './sequenceDataSelector';
import {createSelector} from 'reselect';

export default createSelector(
  sequenceDataSelector,
  function (sequenceData) {
    return sequenceData.sequence.length
  }
)


import Plus from 'react-icons/lib/fa/plus';
import specialCutsiteFilterOptions from '../constants/specialCutsiteFilterOptions'
import React from 'react'
import './style.scss';
import Select from 'react-select';

import map from 'lodash/map'

export default class CutsiteFilter extends React.Component {
  render () {
    var {
      onChangeHook,
      filteredRestrictionEnzymes,
      filteredRestrictionEnzymesUpdate,
      allCutsites: {cutsitesByName},
      sequenceData: {
        sequence: inputSequenceToTestAgainst
      },
      dispatch
      // ...rest
    } = this.props;
    // var {handleOpen, handleClose} = this
    var options = [...map(specialCutsiteFilterOptions, (opt) => opt),...Object.keys(cutsitesByName).map(function (key) {
                      return {label: key, value: key}
                    })]
    function openAddYourOwn() {
      dispatch({
        type: 'ADD_YOUR_OWN_ENZYME_RESET',
        payload: {
          inputSequenceToTestAgainst,
          isOpen: true
        }
      })
    }
    return (
      <div>
        <Select
          multi
          allowCreate
          noResultsText={<div className={'noResultsTextPlusButton'} >No results found. <span onClick={openAddYourOwn} className={'ta_link'}>Add additional enzymes <Plus/></span> </div>}
          placeholder="Filter cut sites..."
          options={options}
          onChange={(filteredRestrictionEnzymes)=>{
            if (filteredRestrictionEnzymes && filteredRestrictionEnzymes.some((enzyme)=>enzyme.value === specialCutsiteFilterOptions.addYourOwn.value)) {
              return openAddYourOwn()
            }
            onChangeHook && onChangeHook(filteredRestrictionEnzymes)
            filteredRestrictionEnzymesUpdate(filteredRestrictionEnzymes);
          }}
          
          value={filteredRestrictionEnzymes}
        />
      </div>
    )
  }
}


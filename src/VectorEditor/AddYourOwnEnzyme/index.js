import map from 'lodash/map';
import enzymeListFull from '../../../../enzymeListFull.json';
import { connect } from 'react-redux'
// import takaraEnzymeList from '../../../../enzymeListFull.json';
import takaraEnzymeList from '../../../../takaraEnzymeList.json';
// import {reduxForm, Field, formValueSelector} from 'redux-form'
import RowItem from '../RowItem'
import React from 'react'
import './style.scss';
import Select from 'react-select';
import cutSequenceByRestrictionEnzyme from 've-sequence-utils/cutSequenceByRestrictionEnzyme';
import QuestionTooltip from '../../../components/QuestionTooltip';
import getReverseComplementSequenceString from 've-sequence-utils/getReverseComplementSequenceString';
import PrimaryButton from '../../../components/PrimaryButton';
import SecondaryButton from '../../../components/SecondaryButton';

class AddYourOwnEnzyme extends React.Component {
  render() {
    var paddingStart = '-------'
    var paddingEnd = '-------'
    var {
      // filteredRestrictionEnzymesAdd,
      // addRestrictionEnzyme,
      inputSequenceToTestAgainst= '', //pass this prop in!
      handleClose,
      seqName='Destination Vector',
      addYourOwnEnzyme,
      dispatch,
      invalid,
      stopAddingYourOwnEnzyme
    } = this.props
    addYourOwnEnzyme.chop_top_index = Number(addYourOwnEnzyme.chop_top_index)
    addYourOwnEnzyme.chop_bottom_index = Number(addYourOwnEnzyme.chop_bottom_index)
    var {
      sequence='',
      chop_top_index=0,
      chop_bottom_index=0,
      name=''
    } = addYourOwnEnzyme
    var regexString = bpsToRegexString(sequence)
    var enzyme = {
      name:name,
      site:sequence,
      forwardRegex:regexString,
      reverseRegex: getReverseComplementSequenceString(regexString),
      topSnipOffset:chop_top_index,
      bottomSnipOffset:chop_bottom_index,
      usForward:0,
      usReverse:0,
      color:'black'
    }
    var matches
    if (regexString.length === 0) {
      matches = []
    } else {
      matches = cutSequenceByRestrictionEnzyme(inputSequenceToTestAgainst, true, enzyme)
    }

    var errors = validate(addYourOwnEnzyme)

    function onChange(updatedVal) {
      dispatch({
        type: 'ADD_YOUR_OWN_ENZYME_UPDATE',
        payload: {
          ...addYourOwnEnzyme,
          ...updatedVal
        },
      })
    }
    var invalidOrNoMatches = invalid || matches.length < 1

    var seqPlusPadding = paddingStart + sequence + paddingEnd

    return <div className={'createYourOwnEnzyme'}>
    <h2>Create your own enzyme</h2>
      <CustomInput error={errors['name']} value={name} onChange={onChange} name='name' label={'Name:'}/>
      <CustomInput error={errors['sequence']} value={sequence} onChange={onChange} name='sequence' label={
        
        <div className='labelWithIcon'>
          <QuestionTooltip>
            <div className={'taLineHolder'}>
              <Line> Special Characters:  </Line>
              <Line> R = G A (purine) </Line>
              <Line> Y = T C (pyrimidine) </Line>
              <Line> K = G T (keto) </Line>
              <Line> M = A C (amino) </Line>
              <Line> S = G C (strong bonds) </Line>
              <Line> W = A T (weak bonds) </Line>
              <Line> B = G T C (all but A) </Line>
              <Line> D = G A T (all but C) </Line>
              <Line> H = A C T (all but G) </Line>
              <Line> V = G C A (all but T) </Line>
              <Line> N = A G C T (any) </Line>
            </div>
          </QuestionTooltip>
          <span>
          Recognition sequence:
          </span>
        </div>
        } 
         onInput={function (input) {
          var inputValue = input.target.value
          var cleanInput = inputValue.replace(/[^rykmswbdhvnagct]/ig, '');
          input.target.value=cleanInput
        }}
        />
      
      <CustomInput error={errors['chop_top_index']} value={chop_top_index} onChange={onChange} name='chop_top_index' label='Chop top index:' type="number"/>
    <CustomInput error={errors['chop_bottom_index']} value={chop_bottom_index} onChange={onChange} name='chop_bottom_index' label='Chop bottom index:' type="number"/>

    <RowItem
    {
      ...{
        // width: 400,
        tickSpacing: 1,
        annotationVisibility:  {
          cutsites: true,
          cutsiteLabels: false,
          axis: false,
        },
        sequenceLength: seqPlusPadding.length,
        bpsPerRow: seqPlusPadding.length,
        row: {
          sequence: seqPlusPadding,
          start: 0,
          end: seqPlusPadding.length-1,
          cutsites: {
            'fake1': {
              annotation: {
                recognitionSiteRange: {
                  start: paddingStart.length,
                  end: paddingStart.length + sequence.length - 1,
                },
                topSnipBeforeBottom: chop_top_index < chop_bottom_index,
                bottomSnipPosition: paddingStart.length + chop_bottom_index,
                topSnipPosition: paddingStart.length +  chop_top_index,
                id: 'fake1',
                restrictionEnzyme: {
                }
              }
            }
          },
        },
      }
    }
    />

    <h3 className={'cutnumber ' + (matches.length === 0 && 'invalid') }>
      {matches.length > 10  
        ? `Cuts more than 10 times in your ${seqName}`
        : `Cuts ${matches.length} times in your ${seqName}`
      }
    </h3>
      <div className={'buttonHolder'}>
        <PrimaryButton className={' ta_useCutsite addYourOwnEnzymeBtn ' + (invalidOrNoMatches && 'disabled') } onClick={function () {
          if (invalidOrNoMatches) {
            return
          }
          dispatch({
            type: 'ADD_RESTRICTION_ENZYME',
            payload: enzyme,
            meta: {
              EditorNamespace: ['MutagenesisEditor','SelectInsertEditor', 'ResultsEditor']
            }
          })
          dispatch({
            type: 'FILTERED_RESTRICTION_ENZYMES_ADD',
            payload: {
              label: name,
              value: name,
            },
            meta: {
              EditorNamespace: ['MutagenesisEditor','SelectInsertEditor', 'ResultsEditor']
            }
          })
          // addRestrictionEnzyme(enzyme)
          // filteredRestrictionEnzymesAdd({
          //   label: name,
          //   value: name,
          // })
          handleClose()
        }}> Use Enzyme</PrimaryButton>
        <SecondaryButton className={'addYourOwnEnzymeBtn'} onClick={stopAddingYourOwnEnzyme}>
          Back
        </SecondaryButton>
      </div>
    
    </div>
  }
}

//   const selector = formValueSelector('customEnzymes')
// AddYourOwnEnzyme = reduxForm({
//   form: 'customEnzymes',
//   destroyOnUnmount: false,
//   initialValues: {
//     name: 'Example Enzyme',
//     sequence: 'ggatcc',
//     chop_top_index: 1,
//     chop_bottom_index: 5,
//   },
//   validate
// })(AddYourOwnEnzyme)

AddYourOwnEnzyme = connect(function (state) {
  return {addYourOwnEnzyme: state.VectorEditor.addYourOwnEnzyme}
})(AddYourOwnEnzyme)

class AddAdditionalEnzymes extends React.Component {
  state = {
    addYourOwnEnzyme: false,
    enzymesToAdd: [],
  };

  startAddingYourOwnEnzyme = () => {
    this.setState({addYourOwnEnzyme: true});
  };

  stopAddingYourOwnEnzyme = () => {
    this.setState({addYourOwnEnzyme: false});
  };

  render() {
    if (this.state.addYourOwnEnzyme) {
      return <AddYourOwnEnzyme {...this.props} stopAddingYourOwnEnzyme={this.stopAddingYourOwnEnzyme} ></AddYourOwnEnzyme>
    }
    var {dispatch, handleClose, inputSequenceToTestAgainst=''} = this.props
    var {enzymesToAdd} = this.state
    return <div className={'addYourOwnEnzyme'}>
        <h2>Add additional enzymes</h2>
        <span>
        Our default list only contains the most common enzymes. Search here to add less common ones:
        </span>
        <div className={'filterAndButton'}>
          <Select
             multi
             placeholder="Select cut sites..."
             options={map(enzymeListFull, function (enzyme) {
               return {label: enzyme.name, value: enzyme}
             })}
             onChange={(enzymesToAdd)=>{
              this.setState({
                enzymesToAdd: enzymesToAdd.map(function ({value}) {
                  var times = cutSequenceByRestrictionEnzyme(inputSequenceToTestAgainst, true, value).length
                  return {
                    label: value.name + ` (Cuts ${times} time${times===1 ? '':'s'})`,
                    value
                  }
                })
              })
             }}
             value={enzymesToAdd}
          />
          <PrimaryButton 
            className={'addYourOwnEnzymeBtn'}
            onClick={function () {
            enzymesToAdd.forEach(function (enzyme) {
              dispatch({
                type: 'ADD_RESTRICTION_ENZYME',
                payload: enzyme.value,
                meta: {
                  EditorNamespace: ['MutagenesisEditor', 'SelectInsertEditor', 'ResultsEditor']
                }
              })
              dispatch({
                type: 'FILTERED_RESTRICTION_ENZYMES_ADD',
                payload: {
                  label: enzyme.label,
                  value: enzyme.value.name,
                },
                meta: {
                  EditorNamespace: ['MutagenesisEditor', 'SelectInsertEditor', 'ResultsEditor']
                }
              })
            })
            handleClose()
          }} 
          disabled={this.state.enzymesToAdd && this.state.enzymesToAdd.length < 1}>
            Add Enzymes

          </PrimaryButton>
        </div>
        <div className={'createYourOwnButton'}>
        <span>
          
          Still not finding what you want?
        </span>
          <PrimaryButton className={'addYourOwnEnzymeBtn'} onClick={this.startAddingYourOwnEnzyme}>
            Create your own enzyme
          </PrimaryButton>
        </div>
    </div>
  }
}

function validate(values) {
  const errors = {}

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Input cannot be blank'
  } else if (takaraEnzymeList[values.name.toLowerCase()]) {
    errors.name = `The name ${values.name} is already taken.`
  }

  if (!values.sequence || values.sequence.trim() === '' || values.sequence.trim().length < 4) {
    errors.sequence = 'Enzyme recognition sequence must be at least 4bps long'
  }

  if (values.sequence && values.sequence.replace(/[^atgcrykmswbdhvn]/ig, '').length !== values.sequence.length) {
    errors.sequence = 'Sequence must only contain valid bases'
  }
  
  if (!values.chop_top_index && values.chop_top_index !== 0) {
    errors.chop_top_index = 'Input cannot be blank'
  }
  if (!values.chop_bottom_index && values.chop_bottom_index !== 0) {
    errors.chop_bottom_index = 'Input cannot be blank'
  }
  return errors
}

AddAdditionalEnzymes = connect(function (state) {
  return {inputSequenceToTestAgainst: state.VectorEditor.addYourOwnEnzyme.inputSequenceToTestAgainst}
})(AddAdditionalEnzymes)

export default AddAdditionalEnzymes


function bpsToRegexString(bps) {
  var regexString = ''
  if (typeof bps === 'string') {
    bps.split('').forEach(function (bp) {
      if (bp === 'r') {
        regexString+= '[ga]'
      }
      else if (bp === 'y') {
        regexString+= '[tc]'
      }
      else if (bp === 'k') {
        regexString+= '[gt]'
      }
      else if (bp === 'm') {
        regexString+= '[ac]'
      }
      else if (bp === 's') {
        regexString+= '[gc]'
      }
      else if (bp === 'w') {
        regexString+= '[at]'
      }
      else if (bp === 'b') {
        regexString+= '[gtc]'
      }
      else if (bp === 'd') {
        regexString+= '[gat]'
      }
      else if (bp === 'h') {
        regexString+= '[act]'
      }
      else if (bp === 'v') {
        regexString+= '[gca]'
      }
      else if (bp === 'n') {
        regexString+= '[agct]'
      }
      else {
        regexString += bp
      }
    })
  }
  return regexString
}

// function CustomInput({name, type, label, onInput}) {
// return <Field name={name} label={label} type={type} onInput={onInput} component={RenderInput} >
// </Field>
// }

function CustomInput({name, value, onChange, onInput, label, error, type}) {
 return <div className={'inputHolder ' + (error && 'error')} >
  <div>
   <span>
    {label}
   </span>
   <input value={value} onChange={function (e) {
     onChange({
      [name]: e.target.value
     })
   }} onInput={onInput}  type={type} />
  </div>
   {error && <p className='errorMessage'>{error}</p>}
 </div>
}

function Line({children}) {
  return <div className={'taLine'} > {children}</div>
}
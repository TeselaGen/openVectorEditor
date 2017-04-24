// import download from 'in-browser-download'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import DropDown from 'react-icons/lib/md/arrow-drop-down'
import InfoCircle from 'react-icons/lib/fa/info-circle';
import Popover from 'react-popover2'
import jsonToGenbank from 'bio-parsers/parsers/jsonToGenbank'
import React from 'react'
// import get from 'lodash/get'
import './style.scss'
import CutsiteFilter from '../CutsiteFilter'
import FileSaver from 'file-saver';
import Radio from '../../../components/Radio';

export default class VeToolBar extends React.Component {
  state={
    openItem: -1
  }
  
  handleOpen=(popover)=> {
    var self = this
    return function () {
      if (self.state.openItem === popover) {
        return self.setState({openItem: -1})
      }
      self.setState({openItem: popover})
    }
  }

  handleClose= ()=> {
    this.setState({openItem: ''})
  }

  render () {
    var self = this
    var {
        sequenceData,
        annotationVisibilityToggle,
        annotationVisibilityShow,
        annotationVisibilityHide,
        annotationVisibility,
        AdditionalTools = [],
        minimumOrfSizeUpdate,
        minimumOrfSize,
        panelsShown,
        panelsShownUpdate,
        sequenceLength,
        excludeObj={},
    } = this.props;
    var items = [
    {
      component: <div
        onClick={function () {
          var blob = new Blob([jsonToGenbank(sequenceData)], {type: "text/plain"});
          FileSaver.saveAs(blob, "result_plasmid.gb");
          // downloadSequenceData(sequenceData || )
        }}

        >
        <img src="svgs/veToolbarIcons/save.png" alt="Download .gb file"/>
      </div>,
      tooltip: 'Download .gb file',
      id: 'download'
    },
    // {
    //   component: <div
    //     onClick={function () {
    //       // var myPrintContent = document.getElementById('printdiv');
    //       // var myPrintWindow = window.open(windowUrl, windowName, 'left=300,top=100,width=400,height=400');
    //       // myPrintWindow.document.write(myPrintContent.innerHTML);
    //       // myPrintWindow.document.getElementById('hidden_div').style.display='block'
    //       // myPrintWindow.document.close();
    //       // myPrintWindow.focus();
    //       // myPrintWindow.print();
    //       // myPrintWindow.close();
    //       // return false;
    //       print()
    //       // var content = document.getElementById("divcontents");
    //       // document.appendChild(con)
    //       // var pri = document.getElementById("ifmcontentstoprint").contentWindow;
    //       // pri.document.open();
    //       // pri.document.write(content.innerHTML);
    //       // pri.document.close();
    //       // pri.focus();
    //       // pri.print();
    //       // downloadSequenceData(sequenceData || )
    //     }}
    //     >
    //     <img src="svgs/veToolbarIcons/print.png" alt="Print Vector"/>
    //   </div>,
    //   tooltip: 'Print Vector',
    //   id: 'print'
    // },
    {
      component: <div
        onClick={function () {
          annotationVisibilityToggle('cutsites')
        }}
        >
        <img src="svgs/veToolbarIcons/show_cut_sites.png" alt="Show cut sites"/>
      </div>,
      toggled: annotationVisibility.cutsites,
      tooltip: 'Show cut sites',
      tooltipToggled: 'Hide cut sites',
      dropdown: <div className={'veToolbarCutsiteFilterHolder'}>
        <span>Filter Cut sites:</span>
        <CutsiteFilter onChangeHook={function () {
          self.handleClose()
          annotationVisibilityShow('cutsites')
        }} {...this.props}/> 
      </div>,
      dropdowntooltip: 'Cut site options',
      id: 'cutsites'
    },
    {
      component: <div
        onClick={function () {
          annotationVisibilityToggle('features')
        }}
        >
        <img src="svgs/veToolbarIcons/show_features.png" alt="Show features"/>
      </div>,
      toggled: annotationVisibility.features,
      tooltip: 'Show features',
      tooltipToggled: 'Hide features',
      id: 'features'
    },
    {
      component: <div
        onClick={function () {
          annotationVisibilityToggle('primers')
        }}
        >
        <img src="svgs/veToolbarIcons/show_primers.png" alt="Show oligos"/>
      </div>,
      toggled: annotationVisibility.primers,
      tooltip: 'Show oligos',
      tooltipToggled: 'Hide oligos',
      id: 'primers'
    },
    {
      component: <div
        onClick={function () {
          if (annotationVisibility.orfs) {
            annotationVisibilityHide('orfs')
            annotationVisibilityHide('orfTranslations')
          } else {
            annotationVisibilityShow('orfs')
            annotationVisibilityShow('orfTranslations')
          }
        }}
        >
        <img src="svgs/veToolbarIcons/show_orfs.png" alt="Show Open Reading Frames"/>
      </div>,
      toggled: annotationVisibility.orfs,
      tooltip: 'Show Open Reading Frames',
      tooltipToggled: 'Hide Open Reading Frames',
      dropdown: <div className={'veToolbarOrfOptionsHolder'}>
        <div style={{display: "flex"}}>
        Minimum ORF Size:
        <input 
        type='number' 
        className="minOrfSizeInput" 
        onChange={function (event) {
          var minimumOrfSize = parseInt(event.target.value)
          if (!(minimumOrfSize > -1)) return
          if (minimumOrfSize > sequenceLength) return
          minimumOrfSizeUpdate(minimumOrfSize)
        }} 
        value={minimumOrfSize}></input>
        </div>
        <div className='taSpacer'/>
        <input
        onChange={function () {
          annotationVisibilityToggle('orfTranslations')
        }} 
        checked={annotationVisibility.orfTranslations}
        id='showOrfTranslations'
        type="checkbox"/>
        <span className={'showOrfTranslateSpan'}>Show ORF translations </span>
        <div className='taSpacer'/>
        <InfoCircle/>
        <span className={'translateInfoSpan'}>To translate an arbitrary area, right click a selection.</span>


      </div>,
      dropdowntooltip: 'Open Reading Frame options',
      id: 'orfs'
    },
    {
      dropdown: <div className={'veToolbarViewOptionsHolder'}>
        <div>Show View:</div> 
        <Radio
          onChange={() => {
            panelsShownUpdate({
              circular: true,
              sequence: false
            })
          }}
          checked={panelsShown.circular && !panelsShown.sequence}
          label='Circular'
          />
        <Radio
          onChange={() => {
            panelsShownUpdate({
              circular: false,
              sequence: true
            })
          }}
          checked={panelsShown.sequence && !panelsShown.circular}
          label='Sequence'
        />
        <Radio
          onChange={() => {
            panelsShownUpdate({
              circular: true,
              sequence: true
            })
          }}
          checked={panelsShown.sequence && panelsShown.circular}
          label='Both'
        />
      </div>,
      dropdownicon: <img src="svgs/veToolbarIcons/fullscreen.png" alt="Toggle Views"/>,
      dropdowntooltip: 'Toggle Views',
      id: 'toggleViews'
    },
    ...AdditionalTools
    ]

    
    items = items.filter(function (item) {
      if (excludeObj[item.id]) {
        return false
      } else {
        return true
      }
    })
    var content = items.map(function ({
        component,
        tooltip= '',
        tooltipToggled,
        dropdowntooltip='',
        dropdown,
        dropdownicon,
        toggled= false,
        id
      }, index) {
          
      var tooltipToDisplay = tooltip
      if (toggled && tooltipToggled) {
        tooltipToDisplay = tooltipToggled
      }
      return <div 
        key={index}
        className={'veToolbarItemOuter'}>
        {component && <div
          aria-label={tooltipToDisplay}
          className={' hint--bottom-left veToolbarItem'}>
          {index !== 0 && <div className={'veToolbarSpacer'}/>}
          <div className={'veToolbarIcon ' + (toggled ? ' veToolbarItemToggled' : '')}>
            {component}
          </div>
        </div>}
        {
          dropdown && 
          <Popover 
            preferPlace='below'
            onOuterAction={self.handleClose}
            isOpen={index=== self.state.openItem}
            body={dropdown}>
            <div
            key={index + 'dropdownOnClick'}
            aria-label={dropdowntooltip}
            onClick={self.handleOpen(index)}
            className={' hint--bottom-left ' + (dropdownicon ? '' : ' veToolbarDropdown')}>
              {dropdownicon ? <div className={'veToolbarIcon'}>
                <div>
                  {dropdownicon}
                </div>
              </div>  : <DropDown/>}
            </div>
          </Popover>
        }
      </div>
    })

    return <div className={'veToolbar'}>
      {content}
    </div>
  }
}


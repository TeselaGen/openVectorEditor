import { getVirtualDigest } from "ve-sequence-utils/lib";
import { MAX_DIGEST_CUTSITES, MAX_PARTIAL_DIGEST_CUTSITES } from "../constants/constants";

export default class DigestTool {

  constructor({ed}){
    this.ed = ed
  }
  selectedFragment= undefined;
  computePartialDigest= false;
  updateSelectedFragment(payload) {
    this.selectedFragment = payload
  }
  updateComputePartialDigest(payload){
    this.computePartialDigest = payload
  }

  get computePartialDigestDisabled(){
    return this.cutsites.length > MAX_PARTIAL_DIGEST_CUTSITES;
  }

  get computeDigestDisabled(){
    return this.cutsites.length > MAX_DIGEST_CUTSITES;
  }

  get virtualDigest(){
    const { fragments, overlappingEnzymes } = getVirtualDigest({
      cutsites: this.ed.cutsites,
      sequenceLength: this.ed.sequenceLength,
      isCircular: this.ed.circular,
      computePartialDigest: this.ed.computePartialDigest,
      computePartialDigestDisabled: this.ed.computePartialDigestDisabled,
      computeDigestDisabled: this.ed.computeDigestDisabled
    });

    const lanes =  [
      fragments.map((f) => ({
        ...f,
        onFragmentSelect: () => {
          this.ed.selectionLayerUpdate({
            start: f.start,
            end: f.end,
            name: f.name
          });
          this.ed.updateSelectedFragment(f.Intentid);
        }
      }))
    ]

    return {lanes,overlappingEnzymes}
  }
}



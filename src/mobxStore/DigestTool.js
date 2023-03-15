export default class DigestTool {
  selectedFragment= undefined;
  computePartialDigest= false;
  updateSelectedFragment(payload) {
    this.selectedFragment = payload
  }
  updateComputePartialDigest(payload){
    this.computePartialDigest = payload
  }
}



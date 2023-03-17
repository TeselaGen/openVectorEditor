import { forEach } from "lodash";

export default class FeatureLengthsToHide {
  enabled = false;
  min = 0;
  max = 800;
  updateFeatureLengthsToHide(opts){
    forEach(opts, (val, key) => {
      this[key] = val;
    });
  }
  toggleFeatureLengthsToHide(){
    this.enabled = !this.enabled
  }
}

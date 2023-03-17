import { forEach } from "lodash";
import { makeAutoObservable } from "mobx";

export default class FeatureLengthsToHide {
  constructor() {
    makeAutoObservable(this)
  }
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

import { makeAutoObservable } from "mobx";

const newVal = window.localStorage.getItem("labelLineIntensity");
export default class LabelLineIntensity {
  constructor() {
    makeAutoObservable(this)
  }
  intensity = newVal ? parseFloat(newVal) : 0.1;
  changeLabelLineIntensity(payload) {
    this.intensity = payload;
  }
}

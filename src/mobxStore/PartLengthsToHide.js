import { makeAutoObservable } from "mobx";

export default class PartLengthsToHide {
  constructor() {
    makeAutoObservable(this);
  }
  enabled = false;
  min = 0;
  max = 800;
  updatePartLengthsToHide(payload) {
    for (const key in payload) {
      this[key] = payload[key];
    }
  }
  togglePartLengthsToHide() {
    this.enabled = !this.enabled;
  }
}

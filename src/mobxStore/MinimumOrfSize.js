import { makeAutoObservable } from "mobx";

export default class MinimumOrfSize {
  constructor() {
    makeAutoObservable(this)
  }
  minSize = 300;
  minumumOrfSizeUpdate(payload){
    this.minSize = payload
  }

  getMinimumOrfSize(){
    return this.minSize
  }
}

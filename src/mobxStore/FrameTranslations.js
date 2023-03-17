import { makeAutoObservable } from "mobx"

export default class FrameTranslations {
  constructor() {
    makeAutoObservable(this)
  }
  frameTranslations = {
  "1": false,
  "2": false,
  "3": false,
  "-1": false,
  "-2": false,
  "-3": false
  }
  frameTranslationToggle(payload){
    this.frameTranslation[payload] = !this.frameTranslation[payload]
  }
  frameTranslationToggleOn(payload){
    this.frameTranslation[payload] = true
  }
  frameTranslationToggleOff(payload){
    this.frameTranslation[payload] = false
  }
}
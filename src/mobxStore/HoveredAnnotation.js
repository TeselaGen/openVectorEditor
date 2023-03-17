import { makeAutoObservable } from "mobx"

export default class HoveredAnnotation{
  constructor() {
    makeAutoObservable(this)
  }
  annotation = ""
  hoveredAnnotationUpdate(payload){
    this.annotation = payload
  }
  hoveredAnnotationClear(){
    this.annotation = ""
  }
}

import { makeAutoObservable } from "mobx"

export default class AnnotationLabelVisibility{
  constructor() {
    makeAutoObservable(this)
  }
  features= true
  parts= true
  primers= true
  cutsites= true
  assemblyPieces= true
  lineageAnnotations= true
  warnings= true

  annotationLabelVisibilityToggle(payload){
    this[payload] = !this[payload]
  }
  annotationLabelVisibilityShow(payload){
    this[payload] = true
  }
  annotationLabelVisibilityHide(payload){
    this[payload] = false
  }
}


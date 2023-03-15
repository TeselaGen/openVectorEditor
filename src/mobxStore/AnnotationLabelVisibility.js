export default class AnnotationLabelVisibility{
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


export default class HoveredAnnotation{
  annotation = ""
  hoveredAnnotationUpdate(payload){
    this.annotation = payload
  }
  hoveredAnnotationClear(){
    this.annotation = ""
  }
}

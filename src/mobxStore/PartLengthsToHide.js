export default class PartLengthsToHide{
  enabled = false
  min = 0
  max = 800
  updatePartLengthsToHide(payload){
    for (const key in payload) {
      this[key] = payload[key]
    }
  }
  togglePartLengthsToHide(){
    this.enabled = !this.enabled
  }
}

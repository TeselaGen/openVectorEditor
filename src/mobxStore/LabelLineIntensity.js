export default class LabelLineIntensity{
  private newVal = window.localStorage.getItem("labelLineIntensity");
  intensity = this.newVal ? parseFloat(this.newVal) : 0.1
  changeLabelLineIntensity(payload){
    this.intensity = payload
  }
}

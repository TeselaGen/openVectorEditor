const newVal = window.localStorage.getItem("labelLineIntensity");
export default class LabelLineIntensity {
  intensity = newVal ? parseFloat(newVal) : 0.1;
  changeLabelLineIntensity(payload) {
    this.intensity = payload;
  }
}

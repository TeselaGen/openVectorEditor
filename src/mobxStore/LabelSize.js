const newVal = window.localStorage.getItem("labelSize");
export default class LabelSize {
  size = newVal ? parseInt(newVal) : 8;
  changeLabelSize(payload) {
    this.size = payload;
  }
}

export default class LabelSize{
  private newVal = window.localStorage.getItem("labelSize");
  size = this.newVal ? parseInt(this.newVal) : 8
  changeLabelSize(payload){
    this.size = payload
  }
}


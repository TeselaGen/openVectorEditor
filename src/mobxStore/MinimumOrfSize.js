export default class MinimumOrfSize {
  minSize = 300;
  minumumOrfSizeUpdate(payload){
    this.minSize = payload
  }

  getMinimumOrfSize(){
    return this.minSize
  }
}

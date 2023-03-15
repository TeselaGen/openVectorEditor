export default class LastSavedId {
  savedId = undefined;
  lastSavedIdUpdate(payload){
    this.savedId = payload
  }
}

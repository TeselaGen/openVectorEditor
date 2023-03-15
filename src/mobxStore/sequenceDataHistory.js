export default class SequenceDataHistory{
  past= []
  future= []

  addToUndoStack = (payload) => {
    this.past = [...(this.past||[]), payload];
    this.future = [];
  }

  veUndo = (presentState) => {
    this.past = (this.past||[]).slice(0, -1);
    this.future = (this.future||[]).concat(presentState);
  }
  
  veRedo = (presentState) => {
    this.future = (this.future||[]).slice(0, -1);
    this.past = (this.past||[]).concat(presentState);
  }
}
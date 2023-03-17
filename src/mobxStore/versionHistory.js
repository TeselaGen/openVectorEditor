import { makeAutoObservable } from "mobx";

export default class VersionHistory{
  constructor() {
    makeAutoObservable(this)
  }
  viewVersionHistory = false;

  toggleViewVersionHistory() {
    this.viewVersionHistory = !this.viewVersionHistory;
  }
}

import { makeAutoObservable } from "mobx";

export default class PropertiesTool {
  constructor() {
    makeAutoObservable(this)
  }
  tabId = "general";
  selectedAnnotationId = undefined;

  propertiesViewTabUpdate(tabId,selectedAnnotationOrAnnotationId) {
    this.tabId = tabId
    this.selectedAnnotationId = selectedAnnotationOrAnnotationId
  }
}


export default class PropertiesTool {
  tabId = "general";
  selectedAnnotationId = undefined;

  propertiesViewTabUpdate(tabId,selectedAnnotationOrAnnotationId) {
    this.tabId = tabId
    this.selectedAnnotationId = selectedAnnotationOrAnnotationId
  }
}


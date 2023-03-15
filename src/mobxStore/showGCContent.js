export default class ShowGCContent{
  showGCContent = window.localStorage.getItem("showGCContent") || false;

  toggleShowGCContent = (val) => {
    localStorage.setItem("showGCContent", val);
    this.showGCContent = val;
  };
}
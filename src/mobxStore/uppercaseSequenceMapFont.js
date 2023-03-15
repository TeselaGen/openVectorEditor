export default class UppercaseSequenceMapFont{
  private newVal = window.localStorage.getItem("uppercaseSequenceMapFont");
  uppercaseSequenceMapFont = newVal || "noPreference";

  updateSequenceCase = (uppercaseSequenceMapFont) => {
    this.uppercaseSequenceMapFont = uppercaseSequenceMapFont;
  };
}

import { findSequenceMatches } from "ve-sequence-utils/lib";

export default class FindTool {
  constructor(ed) {
    this.ed = ed;
  }
  isOpen = false;
  isInline = !localStorage.getItem("veFindBarIsExpanded");
  searchText = "";
  dnaOrAA = "DNA";
  ambiguousOrLiteral = "LITERAL";
  highlightAll = false;
  matchNumber = 0;
  get searchLayers() {
    if (!this.searchText || !this.isOpen) {
      return [];
    }
    if (this.ed.isProtein) {
      const searchingDna = this.dnaOrAA === "DNA";
      const matches = findSequenceMatches(
        searchingDna ? this.ed.sequence : this.ed.proteinSequence,
        this.searchText,
        {
          isCircular: false,
          isProteinSequence: true,
          isAmbiguous: this.ambiguousOrLiteral === "AMBIGUOUS",
          // isProteinSearch: dnaOrAA !== "DNA",
          searchReverseStrand: false
        }
      ).sort(({ start }, { start: start2 }) => {
        return start - start2;
      });
      return searchingDna
        ? matches
        : matches.map(({ start, end, ...rest }) => ({
            ...rest,
            isSearchLayer: true,
            start: start * 3,
            end: end * 3 + 2
          }));
    }
    const matches = findSequenceMatches(
      this.ed.sequence,
      this.ed.searchString,
      {
        isCircular: this.ed.circular,
        isAmbiguous: this.ambiguousOrLiteral === "AMBIGUOUS",
        isProteinSearch: this.dnaOrAA !== "DNA",
        searchReverseStrand: true
      }
    ).sort(({ start }, { start: start2 }) => {
      return start - start2;
    });
    return matches.map((match) => ({
      ...match,
      forward: !match.bottomStrand,
      className:
        "veSearchLayer " +
        (match.bottomStrand ? " veSearchLayerBottomStrand" : ""),
      isSearchLayer: true
    }));
  }
  get translationSearchMatches() {
    if (this.dnaOrAA === "DNA") return [];
    if (!this.highlightAll) return [this.searchLayers[this.matchNumber]];
    return this.searchLayers;
  }
  toggleFindTool() {
    this.isOpen = !this.isOpen;
  }

  toggleHighlightAll() {
    this.highlightAll = !this.highlightAll;
  }
  toggleIsInline() {
    this.isInline = !this.isInline;
    localStorage.setItem("veFindBarIsExpanded", this.isInline);
  }
  updateAmbiguousOrLiteral(p) {
    this.matchNumber = 0;
    this.ambiguousOrLiteral = p;
  }

  updateDnaOrAA(p) {
    this.matchNumber = 0;
    this.dnaOrAA = p;
  }

  updateSearchText(p) {
    this.matchNumber = 0;
    this.searchText = p;
  }
  updateMatchNumber(p) {
    this.matchNumber = p;
  }
}

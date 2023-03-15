import specialCutsiteFilterOptions from "../constants/specialCutsiteFilterOptions";
export default class RestrictionEnzymes{
  filteredRestrictionEnzymes = [specialCutsiteFilterOptions.single];
  isEnzymeFilterAnd = false;

  filteredRestrictionEnzymesUpdate(payload) {
    this.filteredRestrictionEnzymes = payload;
  }
  
  filteredRestrictionEnzymesAdd(payload) {
    this.filteredRestrictionEnzymes = [...this.filteredRestrictionEnzymes, payload]
  }

  filteredRestrictionEnzymesReset() {
    this.filteredRestrictionEnzymes = [specialCutsiteFilterOptions.single]
  }

  isEnzymeFilterAndUpdate(isEnzymeFilterAnd) {
    this.isEnzymeFilterAnd = isEnzymeFilterAnd;
  }
}
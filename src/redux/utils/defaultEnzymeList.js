import { enzymeList } from "ve-sequence-utils";
import defaultEnzymeListJson from "./defaultEnzymeListJson.json";

export default defaultEnzymeListJson.map(e => enzymeList[e]);

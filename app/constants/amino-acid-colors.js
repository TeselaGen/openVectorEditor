// this isn't really a constant list but it takes an amino acid and returns the amino acid's color

module.exports = function(aminoAcid) {
    var color = "#BEA06E";
    switch(aminoAcid) {
        case "A":
            color = "#808080";
            break;

        case "R":
        case "K":
            color = "#145AFF";
            break;

        case "N":
        case "Q":
            color = "#00DCDC";
            break;

        case "D":
        case "E":
            color = "#E60A0A";
            break;

        case "C":
        case "M":
            color = "#E6E600";
            break;

        case "G":
            color = "#C0C0C0";
            break;

        case "H":
            color = "#8282D2";
            break;

        case "I":
        case "L":
        case "V":
            color = "#228b22";
            break;

        case "F":
        case "Y":
            color = "#3232AA";
            break;

        case "P":
            color = "#DC9682";
            break;

        case "S":
        case "T":
            color = "#FA9600";
            break;

        case "W":
            color = "#B45AB4";
            break;

        default:
            // leave it gray
    }
    return color;
}

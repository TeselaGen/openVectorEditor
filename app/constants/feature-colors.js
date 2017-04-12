// this isn't really a constant list but it takes a feature and returns the feature's color

module.exports = function(feature) {
    var type = feature.type;
    type = type.toLowerCase();
    var color = "#CCCCCC";
        switch(type) {
            case "promoter":
                color = "#31B440";
                break;
            case "terminator":
                color = "#F51600";
                break;
            case "cds":
                color = "#EF6500";
                break;
            case "misc_feature":
                color = "#006FEF";
                break;
            case "m_rna":
                color = "#FFFF00";
                break;
            case "misc_binding":
                color = "#006FEF";
                break;                   
            case "misc_marker":
                color = "#8DCEB1";
                break;
            case "rep_origin":
                color = "#878787";
                break;
            default:
                // leave it gray            
        }
    return color;
}
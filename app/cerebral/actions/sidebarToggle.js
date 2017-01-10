module.exports = function sidebarToggle({input, state, output}) {
    var currentSidebar = state.get('showSidebar');
    // hide the rowview when the sidebar pops out
    var currentRow = state.get('showRow');

    state.set('showRow', !currentRow);
    state.set('showSidebar', !currentSidebar);
    state.set('sidebarType', 'Features'); // features are default but making sure
    var sidebarCSS = {
        "transform": ["scaleX(1)", "scaleX(-1)"],
        "filter": ["", "FlipH"],
        "msFilter": ["", "'FlipH'"],
        "MozTransform": ["scaleX(1)", "scaleX(-1)"],
        "OTransform": ["scaleX(1)", "scaleX(-1)"],
        "WebkitTransform": ["scaleX(1)", "scaleX(-1)"]
    };

    var idx = state.get('showSidebar') ? 1 : 0;
    var svgInput = document.getElementById("openFeatureDisplay");
    svgInput.style.transform = sidebarCSS["transform"][idx];
    svgInput.style.filter = sidebarCSS["filter"][idx];
    svgInput.style.msFilter = sidebarCSS["msFilter"][idx];
    svgInput.style.MozTransform = sidebarCSS["MozTransform"][idx];
    svgInput.style.OTransform = sidebarCSS["OTransform"][idx];
    svgInput.style.WebkitTransform = sidebarCSS["WebkitTransform"][idx];
}

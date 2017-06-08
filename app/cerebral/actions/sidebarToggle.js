module.exports = function sidebarToggle({input: {sidebar, annotation, view}, state, output}) {
    var currentSidebar = state.get('showSidebar');
    if (sidebar) {
        currentSidebar = false;
    }

    // hide the rowview if viewing side-by-side when sidebar opens
    if (!currentSidebar && state.get('showRow') && state.get('showCircular')) {
        state.set('showRow', false);
    }

    // makesure sidebar open to correct tab
    var type;
    if (annotation && annotation.numberOfCuts) {
        type = 'Cutsites';
    } else if (annotation && annotation.internalStartCodonIndices) {
        type = 'Orfs';
    } else if (annotation && annotation.name) {
        type = 'Features';
    }

    if (type) {
        state.set('sidebarType', type);
    }

    // keep view that was clicked on, close the other
    if (view === "row") {
        state.set('showRow', true);
        state.set('showCircular', false);
    } else if (view === "circular"){
        state.set('showRow', false);
        state.set('showCircular', true);
    }

    state.set('showSidebar', !currentSidebar);

    var sidebarCSS = {
        "transform": ["scaleX(1)", "scaleX(-1)"],
        "filter": ["", "FlipH"],
        "msFilter": ["", "'FlipH'"],
        "MozTransform": ["scaleX(1)", "scaleX(-1)"],
        "OTransform": ["scaleX(1)", "scaleX(-1)"],
        "WebkitTransform": ["scaleX(1)", "scaleX(-1)"]
    };

    var idx = currentSidebar ? 0 : 1;
    var svgInput = document.getElementById("openFeatureDisplay");
    svgInput.style.transform = sidebarCSS["transform"][idx];
    svgInput.style.filter = sidebarCSS["filter"][idx];
    svgInput.style.msFilter = sidebarCSS["msFilter"][idx];
    svgInput.style.MozTransform = sidebarCSS["MozTransform"][idx];
    svgInput.style.OTransform = sidebarCSS["OTransform"][idx];
    svgInput.style.WebkitTransform = sidebarCSS["WebkitTransform"][idx];
}

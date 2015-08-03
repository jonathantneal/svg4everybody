!function(root, factory) {
    "function" == typeof define && define.amd ? define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof exports ? module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    function embed(svg, g) {
        if (g) {
            var viewBox = g.getAttribute("viewBox"), fragment = document.createDocumentFragment(), clone = g.cloneNode(!0);
            for (viewBox && svg.setAttribute("viewBox", viewBox); clone.childNodes.length; ) {
                fragment.appendChild(clone.childNodes[0]);
            }
            svg.appendChild(fragment);
        }
    }
    function onload() {
        var xhr = this, x = document.createElement("x"), s = xhr.s;
        x.innerHTML = xhr.responseText, xhr.onload = function() {
            s.splice(0).map(function(array) {
                embed(array[0], x.querySelector("#" + array[1].replace(/(\W)/g, "\\$1")));
            });
        }, xhr.onload();
    }
    function svg4everybody() {
        var use, uses = document.getElementsByTagName("use");
        for (;use = uses[0]; ) {
            if (NOSVG) {
                var src, q, img = new Image();
                src = use.getAttribute("xlink:href"), q = (/\?[^#]+/.exec(src) || [ "" ])[0], img.src = src.replace(/\?[^#]+/, "").replace("#", ".").replace(/^\./, "") + ".png" + q, 
                use.parentNode.replaceChild(img, use);
            } else {
                if (NOEXT) {
                    var svg = use.parentNode, url = use.getAttribute("xlink:href").split("#"), url_root = url[0], url_hash = url[1];
                    if (svg.removeChild(use), url_root.length) {
                        var xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();
                        xhr.s || (xhr.s = [], xhr.open("GET", url_root), xhr.onload = onload, xhr.send()), 
                        xhr.s.push([ svg, url_hash ]), 4 === xhr.readyState && xhr.onload();
                    } else {
                        embed(svg, document.getElementById(url_hash));
                    }
                }
            }
        }
        requestAnimationFrame(svg4everybody);
    }
    var CACHE = {};
    var NOSVG = /MSIE\s[1-8]\b/.test(navigator.userAgent);
    var NOEXT = NOSVG || (navigator.userAgent.match(/AppleWebKit\/(\d+)|Edge\/12\b|Trident\/[567]\b/) || [])[1] < 538;
    NOSVG && (document.createElement("svg"), document.createElement("use"));
    var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;
    return svg4everybody;
});
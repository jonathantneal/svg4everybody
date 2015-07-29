!function(root, factory) {
    "function" == typeof define && define.amd ? define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof exports ? module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
    function embed(svg, g) {
        if (g) {
            var viewBox = !svg.getAttribute("viewBox") && g.getAttribute("viewBox"), fragment = document.createDocumentFragment(), clone = g.cloneNode(!0);
            for (viewBox && svg.setAttribute("viewBox", viewBox); clone.childNodes.length; ) {
                fragment.appendChild(clone.childNodes[0]);
            }
            svg.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
                var x = document.createElement("x");
                x.innerHTML = xhr.responseText, xhr.s.splice(0).map(function(array) {
                    embed(array[0], x.querySelector("#" + array[1].replace(/(\W)/g, "\\$1")));
                });
            }
        }, xhr.onreadystatechange();
    }
    function svg4everybody(opts) {
        function oninterval() {
            for (var use; use = uses[0]; ) {
                var svg = use.parentNode;
                if (svg && /svg/i.test(svg.nodeName)) {
                    if (shim) {
                        var img = new Image(), width = svg.getAttribute("width"), height = svg.getAttribute("height");
                        img.src = fallbackSrc(use.getAttribute("xlink:href"), svg), width && img.setAttribute("width", width), 
                        height && img.setAttribute("height", height), svg.replaceChild(img, use);
                    } else {
                        if (shimExternalContent) {
                            var url = use.getAttribute("xlink:href").split("#"), url_root = url[0], url_hash = url[1];
                            if (svg.removeChild(use), url_root.length) {
                                var xhr = svgCache[url_root] = svgCache[url_root] || new XMLHttpRequest();
                                xhr.s || (xhr.s = [], xhr.open("GET", url_root), xhr.send()), xhr.s.push([ svg, url_hash ]), 
                                loadreadystatechange(xhr);
                            } else {
                                embed(svg, document.getElementById(url_hash));
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(oninterval, 17);
        }
        opts = opts || {};
        var uses = document.getElementsByTagName("use"), fallbackSrc = (document.createElement("script"), 
        "fallbackSrc" in opts ? opts.fallbackSrc : function(src) {
            return src.replace(/\?[^#]+/, "").replace("#", ".").replace(/^\./, "") + ".png" + (/\?[^#]+/.exec(src) || [ "" ])[0];
        }), shim = !1;
        shim = "shim" in opts ? opts.shim : /\bMSIE [1-8]\b/.test(navigator.userAgent), 
        shim && (document.createElement("svg"), document.createElement("use"));
        var shimExternalContent = "shimExternalContent" in opts ? opts.shimExternalContent : shim || /\bEdge\/12\b|\bTrident\/[567]\b|\bVersion\/7.0 Safari\b/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537, requestAnimationFrame = window.requestAnimationFrame || setTimeout, svgCache = {};
        shimExternalContent && oninterval();
    }
    return svg4everybody;
});
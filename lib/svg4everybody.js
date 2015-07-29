/*! svg4everybody v1.0.0 | github.com/jonathantneal/svg4everybody */

var CACHE = {};
var NOSVG = /MSIE\s[1-8]\b/.test(navigator.userAgent);
var NOEXT = NOSVG || (navigator.userAgent.match(/AppleWebKit\/(\d+)|Edge\/12\b|Trident\/[567]\b/) || [])[1] < 538;

if (NOSVG) {
	document.createElement('svg');
	document.createElement('use');
}

var uses = document.getElementsByTagName('use');
var requestAnimationFrame = window.requestAnimationFrame || window.setTimeout;

function embed(svg, g) {
	if (g) {
		var
		viewBox = g.getAttribute('viewBox'),
		fragment = document.createDocumentFragment(),
		clone = g.cloneNode(true);

		if (viewBox) {
			svg.setAttribute('viewBox', viewBox);
		}

		while (clone.childNodes.length) {
			fragment.appendChild(clone.childNodes[0]);
		}

		svg.appendChild(fragment);
	}
}

function onload() {
	var xhr = this, x = document.createElement('x'), s = xhr.s;

	x.innerHTML = xhr.responseText;

	xhr.onload = function () {
		s.splice(0).map(function (array) {
			embed(array[0], x.querySelector('#' + array[1].replace(/(\W)/g, '\\$1')));
		});
	};

	xhr.onload();
}

function svg4everybody() {
	var use;

	while (use = uses[0]) {
		if (NOSVG) {
			var img = new Image(), src, q;

			src = use.getAttribute('xlink:href');
			q = (/\?[^#]+/.exec(src) || [''])[0];
			img.src = src.replace(/\?[^#]+/, '').replace('#', '.').replace(/^\./, '') + '.png' + q;

			use.parentNode.replaceChild(img, use);
		} else {
			var
			svg = use.parentNode,
			url = use.getAttribute('xlink:href').split('#'),
			url_root = url[0],
			url_hash = url[1];

			svg.removeChild(use);

			if (url_root.length) {
				var xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();

				if (!xhr.s) {
					xhr.s = [];

					xhr.open('GET', url_root);

					xhr.onload = onload;

					xhr.send();
				}

				xhr.s.push([svg, url_hash]);

				if (xhr.readyState === 4) {
					xhr.onload();
				}

			} else {
				embed(svg, document.getElementById(url_hash));
			}
		}
	}

	requestAnimationFrame(svg4everybody);
}

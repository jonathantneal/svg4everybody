(function (document, requestAnimationFrame, CACHE, settings) {
	var defaults = {
		copyAttributes: ['id', 'class', 'title'],
		replaceExt: '.png'
	};

	for (var field in defaults) { settings[field] = typeof settings[field] == 'undefined' ? defaults[field] : settings[field]; }

	if (typeof settings.fix == 'undefined') {
		var
		svgclippaths = !! document.createElementNS &&
			/SVGClipPath/.test({}.toString.call(document.createElementNS('http://www.w3.org/2000/svg', 'clipPath'))),
		LTEIE8 = /MSIE\s[1-8]\b/.test(navigator.userAgent),
		IE9TO11 = /Trident\/[567]\b/.test(navigator.userAgent);

    		settings.fix = false;

    		if (!svgclippaths || LTEIE8){
    			settings.fix = 'replace';
    		}else if(svgclippaths || IE9TO11){
    			settings.fix = 'svgclippaths';
    		}
	}

	function onload() {
		var xhr = this, x = document.createElement('x'), s = xhr.s;

		x.innerHTML = xhr.responseText;

		xhr.onload = function () {
			s.splice(0).map(function (array) {
				var g = x.querySelector('#' + array[1]);

				if (g) {
					g = g.cloneNode(true);

					g.removeAttribute('id');

					array[0].appendChild(g);
				}
			});
		};

		xhr.onload();
	}

	function onframe() {
		var use;

		while ((use = document.getElementsByTagName('use')[0])) {
			var svg = use.parentNode;

			if (settings.fix == 'replace') {
				var
				div = document.createElement('div'),
				img = new Image();

				img.src = use.getAttribute('xlink:href').replace('#', '.') + settings.replaceExt;

				if (settings.copyAttributes && settings.copyAttributes.length > 0) {
					for (var i = settings.copyAttributes.length - 1; i >= 0; i--) {
						var
						attributeName = settings.copyAttributes[i],
						attributeValue = svg.getAttribute(attributeName);

						/* can't use .hasAttribute in ie < 8 */
						attributeValue = (!attributeValue || attributeValue === 'undefined' || attributeValue.length == 0) ? false : attributeValue;

						if (attributeValue) {
							div.setAttribute(attributeName, attributeValue);

							if (attributeName == 'title') img.setAttribute('alt', attributeValue);
						}
					}
				}

				div.appendChild(img);

				svg.parentNode.replaceChild(div, svg);
			} else if(settings.fix == 'svgclippaths') {
				var
				url = use.getAttribute('xlink:href').split('#'),
				url_root = url[0],
				url_hash = url[1],
				xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();

				svg.removeChild(use);

				if (!xhr.s) {
					xhr.s = [];

					xhr.open('GET', url_root);

					xhr.onload = onload;

					xhr.send();
				}

				xhr.s.push([svg, url_hash]);

				if (xhr.readyState === 4) xhr.onload();
			}
		}

		requestAnimationFrame(onframe);
	}

	if (settings.fix) {
		onframe();
	}
})(
	document,
	window.requestAnimationFrame || window.setTimeout,
	{},
	typeof svg4eb == 'undefined' ? {} : svg4eb,
	document.createElement('svg'),
	document.createElement('use')
);

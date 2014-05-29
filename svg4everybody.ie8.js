(function (document, uses, requestAnimationFrame, CACHE, LTEIE8, IE9TO11) {
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

		while ((use = uses[0])) {
			if (LTEIE8) {
				var
				img = new Image();

				img.src = use.getAttribute('xlink:href').replace('#', '.') + '.png';

				use.parentNode.replaceChild(img, use);
			} else {
				var
				svg = use.parentNode,
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

				if (xhr.readyState === 4) {
					xhr.onload();
				}
			}
		}

		requestAnimationFrame(onframe);		
	}

	if (LTEIE8 || IE9TO11) {
		onframe();
	}
})(
	document,
	document.getElementsByTagName('use'),
	window.requestAnimationFrame || window.setTimeout,
	{},
	/MSIE\s[1-8]\b/.test(navigator.userAgent),
	/Trident\/[567]\b/.test(navigator.userAgent),
	document.createElement('svg'),
	document.createElement('use')
);

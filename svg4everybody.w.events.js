/*! svg4everybody v1.0.0 | github.com/jonathantneal/svg4everybody */
/**
 * Modified version of the plugin with event handlers on
 * DOM attribute change
 */

/**
 * Define MutationObserver if not supported by the browser
 */
MutationObserver = (function () {
	if ( MutationObserver ) {
		return MutationObserver;
	}
	else {
		var
			MutationObserver = function ( cb_fn ) {
				this.cb_fn    = cb_fn;
				this.observed = [];

				setInterval( this.checkAttributes.bind(this), 1000 );
			};

		MutationObserver.prototype.disconnect = function ( el ) {
			var index;
			if ( index = this.isObserved( el ) ) {
				this.observed.splice( index, 1 );
			}
		};

		MutationObserver.prototype.observe = function ( el, configs ) {
			var config;
			if ( ! this.observed[ el ] && configs ) {
				for ( config in configs ) {
					if ( configs.hasOwnProperty( config ) ) {
						if ( config === 'attributes' ) {
							this.observed.push({
								el      : el,
								configs : configs,
								old     : this.getAttrValues( el )
							});
						}
						else {
							console.log( 'The property '+ config +' is not supported on this browser!' );
						}
					}
				}
			}
		};

		MutationObserver.prototype.isObserved = function ( el ) {
			for ( var i = 0, len = this.observed.length; i < len; i++ ) {
				if ( this.observed[ i ].el === el ) {
					break;
				}
			}
			return ( i != len ) ? i : false;
		};

		MutationObserver.prototype.getAttrValues = function ( el ) {
			var i, len, 
				attributes = el.attributes,
				attr_val   = {};

			for ( i = 0, len = attributes.length; i < len; i++ ) {
				attr = attributes[ i ];
				attr_val[ attr.nodeName ] = attr.nodeValue;
			}
			return attr_val;
		};

		MutationObserver.prototype.checkAttributes = function () {
			var i, len, el, attrValues, diff;
			for ( i = 0, len = this.observed.length; i < len; i++ ) {
				el = this.observed[ i ];
				attrValues = this.getAttrValues( el.el );
				diff = this.getDifferences( el.el, attrValues, el.old );

				if ( diff.length ) {
					this.cb_fn( diff );
					this.observed[i].old = attrValues;
				}
			}
		};

		MutationObserver.prototype.getDifferences = function ( el, now, old ) {
			var prop, 
				diff = [];

			for ( prop in now ) {
				if ( ! old.hasOwnProperty( prop ) || now[prop] !== old[prop] ) {
					diff.push({
						type          : 'attributes',
						target        : el,
						attributeName : prop,
						oldValue      : old[ prop ]
					});
				}
			}
			return diff;
		};

		return MutationObserver;
	}
})();

(function (document, uses, requestAnimationFrame, CACHE, IE9TO11) {
	var
		svgNS    = "http://www.w3.org/2000/svg",
		observer = new MutationObserver( function ( mutation ) {
			var i, len, target, parent, new_use, xlink;

			for ( i = 0, len = mutation.length; i < len; i++ ) {
				if ( mutation[ i ].type === 'attributes' &&
						 mutation[ i ].attributeName === 'xlink:href' ) {
					target = mutation[ i ].target;

					if ( xlink = target.getAttribute( 'xlink:href' ) ) {
						parent = target.parentNode;

						new_use = document.createElementNS( svgNS, 'use' );
						copyAttributes( target, new_use, [ 'id', 'xlink:href', 'x', 'y', 'transform' ] );
						parent.replaceChild( new_use, target  );
					}
				}
			}
		});

	function getAttributesList ( el ) {
		for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
	    arr.push(atts[i].nodeName);
		}
		return arr;
	}

	function copyAttributes ( from, to, attributes ) {
		var i, len, attr;

		attributes = attributes || getAttributesList( from );

		for ( i = 0, len = attributes.length; i < len; i++ ) {
			attr = attributes[ i ];
			to.setAttribute( attr, from.getAttribute( attr ) );
		}
	}

	function makeSVGgroup ( element ) {
		var g = document.createElementNS( svgNS, 'g' );
		g.appendChild( element );
		return g;
	}

	function getTransform ( element ) {
    var matrix = element.getAttribute( "transform" );
    if ( matrix == undefined ) {
      matrix = [ 1.0, 0.0, 0.0, 1.0, 0.0, 0.0];
    }
    else {
      if ( matrix.match ( 'matrix' ) ) {
        matrix = matrix.slice(7,-1).split(' ');
        for ( var i = 0; i < matrix.length; i++ ) {
          matrix[ i ] = parseFloat( matrix[ i ] );
        }
      }
      else if ( matrix.match ( 'translate' ) ) {
        matrix = matrix.slice( 10, -1 ).split(' ');
        matrix = [ 1.0, 0.0, 0.0, 1.0, matrix [ 0 ], matrix [ 1 ] ];
      }
    }
    
    return matrix;
  };
  
  function setTransform ( el, matrix ) {
    el.setAttribute("transform", "matrix(" + matrix.join(' ') + ")");
  };

	function fixPosition ( el, old ) {
		var
			x = old.getAttribute( 'x' ) * 1,
			y = old.getAttribute( 'y' ) * 1,
			matrix = getTransform( old );

			matrix[ 4 ] += x;
			matrix[ 5 ] += y;

			setTransform( el, matrix );
			el.setAttribute( 'x', 0 );
			el.setAttribute( 'y', 0 );
	}

	function embed(svg, g, old, place_holder, all ) {
		if (g) {
			var x, y,
			viewBox = g.getAttribute('viewBox'),
			fragment = document.createDocumentFragment(),
			clone = g.cloneNode(true);

			if (viewBox) {
				svg.setAttribute('viewBox', viewBox);
			}

			if ( all ) {
				fragment = clone;
			}
			else {
				while (clone.childNodes.length) {
					fragment.appendChild(clone.childNodes[0]);
				}
			}
			
			fragment = makeSVGgroup( fragment );
			copyAttributes( old, fragment );
			fixPosition( fragment, old );
			observer.observe( fragment, { attributes: true } );

			svg.replaceChild( fragment, place_holder );
		}
	}

	function onload() {
		var xhr = this, x = document.createElement('x'), s = xhr.s;

		x.innerHTML = xhr.responseText;

		xhr.onload = function () {
			s.splice(0).map(function (array) {
				embed(array[0], x.querySelector('#' + array[1].replace(/(\W)/g, '\\$1')), array[2], array[3]);
			});
		};

		xhr.onload();
	}

	function onframe() {
		var use;

		while ((use = uses[0])) {
			var
				g   = document.createElementNS( svgNS, 'g' ),
				svg = use.parentNode,
				url = use.getAttribute('xlink:href').split('#'),
				url_root = url[0],
				url_hash = url[1];

			observer.disconnect( use );
			svg.replaceChild( g, use );

			if (url_root.length) {
				var xhr = CACHE[url_root] = CACHE[url_root] || new XMLHttpRequest();

				if (!xhr.s) {
					xhr.s = [];

					xhr.open('GET', url_root);

					xhr.onload = onload;

					xhr.send();
				}

				xhr.s.push([svg, url_hash, use, g]);

				if (xhr.readyState === 4) {
					xhr.onload();
				}

			} else {
				embed(svg, document.getElementById(url_hash), use, g, true );
			}
		}

		requestAnimationFrame(onframe);
	}

	if (IE9TO11) {
		onframe();
	}
})(
	document,
	document.getElementsByTagName('use'),
	window.requestAnimationFrame || window.setTimeout,
	{},
	/Trident\/[567]\b/.test(navigator.userAgent) || (navigator.userAgent.match(/AppleWebKit\/(\d+)/) || [])[1] < 537
);


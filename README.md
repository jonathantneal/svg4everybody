# SVG for Everybody

Use external SVG spritemaps today. **SVG for Everybody** minds the gap between [SVG-capable browsers](http://caniuse.com/svg) and those which do not support [external SVG spritemaps](http://css-tricks.com/svg-sprites-use-better-icon-fonts/##Browser Support).

---

The following example works without assistance in Chrome, Firefox, and Opera. JavaScript polyfills the experience in IE9-11, while IE8 and below falls back to a PNG.

```html
<script src="/path/to/svg4everybody.ie8.min.js"></script>
```

```html
<svg class="glyph primary" role="img" title="CodePen" viewbox="0 0 64 64"><use xlink:href="cache.svg#codepen"></use></svg>
<svg class="glyph success" role="img" title="YouTube" viewbox="0 0 64 64"><use xlink:href="cache.svg#youtube"></use></svg>
<svg class="glyph danger"  role="img" title="Twitter" viewbox="0 0 64 64"><use xlink:href="cache.svg#twitter"></use></svg>
```

![3 SVG logos](http://i.imgur.com/87Npdzn.png)

**cache.svg spritemap source**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
	<g id="codepen"><title>CodePen</title><path etc.../></g>
	<g id="youtube"><title>YouTube</title><path etc.../></g>
	<g id="twitter"><title>Twitter</title><path etc.../></g>
</svg>
```

**IE6-8 rendered markup**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
	<g id="codepen"><title>CodePen</title><img src="cache.svg.codepen.png"></g>
	<g id="youtube"><title>YouTube</title><img src="cache.svg.youtube.png"></g>
	<g id="twitter"><title>Twitter</title><img src="cache.svg.twitter.png"></g>
</svg>
```

---

When creating SVGs, be sure to review best practices.

- [Tips for Creating Accessible SVG](https://www.sitepoint.com/tips-accessible-svg/)
- [Using ARIA to enhance SVG accessibility](http://blog.paciellogroup.com/2013/12/using-aria-enhance-svg-accessibility/)

---

The standard script is 0.9KB or 408B minified + gzipped. The IE6-8 compatible script (which also works for IE9+) is 1.4KB or 534B minified + gzipped.

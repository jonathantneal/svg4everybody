# SVG for Everybody

[![NPM Version][npm-img]][npm] [![Build Status][ci-img]][ci]

[SVG for Everybody] adds [SVG External Content] support to [all browsers].

To use it now, include the script in your document.

```html
<script src="/path/to/svg4everybody.js"></script>
<script>svg4everybody(); // run it now or whenever you are ready</script>
```

To support Internet Explorer 6-8, include the legacy script instead.

```html
<script src="/path/to/svg4everybody.legacy.js"></script>
<script>svg4everybody(); // run it now or whenever you are ready</script>
```

_As of v2.0.0, you must the manually call `svg4everybody()`. If you are using an AMD/CommonJS dependency loader then you may call it within the callback closure._

IE 6-8 require you to put the script in the `<head>` in order to shiv `<svg>` and `<use>` elements. For best results in IE, set [X-UA-Compatible] to `ie=edge`. This can be done with a response header from the server or the following HTML in the `<head>`.

```html
<meta http-equiv="x-ua-compatible" content="ie=edge">
```

## Usage

Create an SVG image.

**map.svg:**
```html
<svg xmlns="http://www.w3.org/2000/svg">
	<symbol id="codepen" viewBox="0 0 64 64">
		<title>CodePen</title>
		<path etc.../>
	</symbol>
	<symbol id="youtube" viewBox="0 0 64 64">
		<title>YouTube</title>
		<path etc.../>
	</symbol>
	<symbol id="twitter" viewBox="0 0 64 64">
		<title>Twitter</title>
		<path etc.../>
	</symbol>
</svg>
```

This spritemap displays fine in **Chrome**, **Safari 7.1+**, **Firefox**, and **Opera**. [SVG for Everybody] polyfills the experience in **Safari 6**, **IE 6+**, and **Edge 12**.

```html
<svg role="img" title="CodePen">
	<use xlink:href="map.svg#codepen"/>
</svg>
<svg role="img" title="YouTube">
	<use xlink:href="map.svg#youtube"/>
</svg>
<svg role="img" title="Twitter">
	<use xlink:href="map.svg#twitter"/>
</svg>
```

*IE 6-8 requires a trailing slash `/` when using a self-closing `<use/>` element.*

![3 SVG logos](http://i.imgur.com/87Npdzn.png)

Browsers not supporting SVG fallback to images.

```html
<svg role="img" title="CodePen">
	<img src="map.svg.codepen.png">
</svg>
<svg role="img" title="YouTube">
	<img src="map.svg.youtube.png">
</svg>
<svg role="img" title="Twitter">
	<img src="map.svg.twitter.png">
</svg>
```

By default, fallback images point to a PNG file in the same location as the SVG, only with the `#` hash replaced by a `.` dot and then appended with a `.png` extension. If you want to change this behavior, you can define your own fallback.

```js
svg4everybody({
	fallback: function (src, svg, use) {
		// src: current xlink:href String 
		// svg: current SVG Element 
		// use: current USE Element 

		return 'fallback.png'; // ok, always return fallback.png
	}
});
```

All `<use>` elements that are children of an `<svg>` are checked for external content. If you want to change this behavior, you can define your own validator.

```js
svg4everybody({
	validator: function (src, svg, use) {
		// src: current xlink:href String 
		// svg: current SVG Element 
		// use: current USE Element 

		return true; // ok, everything is valid
	}
});
```

You can override whether the script polyfills External Content at all (`polyfill`), or whether SVG should even be used over fallback images (`nosvg`).

```js
svg4everybody({
	nosvg: true, // shiv <svg> and <use> elements and use image fallbacks
	polyfill: true // polyfill <use> elements for External Content
});
```

*Use of the `nosvg` option will requires you to use the legacy version of SVG for Everybody.*

## Implementation status

Modern browsers support external content in SVGs, *except Edge*. No frets; we can shim it.

| OS  | Browser           | SVG | External Content | Shimmed |
|:---:|-------------------|:---:|:----------------:|:-------:|
| *   | Chrome 21+        | ✔   | ✔                | —       |
| *   | Chrome 14-20      | ✔   | ✖                | ✔       |
| *   | Firefox 4+        | ✔   | ✔                | —       |
| *   | Opera 23+         | ✔   | ✔                | —       |
| *   | Opera Mini 8+     | ✔   | ✔                | —       |
| And | And. Browser 40+  | ✔   | ✔                | —       |
| And | And. Browser 4.1+ | ✔   | ✖                | ✔       |
| iOS | iOS 8.1+          | ✔   | ✔                | —       |
| iOS | iOS 6-7           | ✔   | ✖                | ✔       |
| OSX | Saf 7.1+          | ✔   | ✔                | —       |
| OSX | Saf 6             | ✔   | ✖                | ✔       |
| Win | Edge 13           | ✔   | ✔                | —       |
| Win | Edge 12           | ✔   | ✖                | ✔       |
| Win | IE 9 - 11         | ✔   | ✖                | ✔       |
| Win | IE 6 - 8          | ✖   | ✖                | ✔       |

As you can see, **all major browsers support external content**.

We had been waiting on Edge, previously, but [David Storey], Edge’s project manager assured us that native support for external content in SVGs was high on their checklist. We would [track progress] and [vote for attention] to this issue. Then, just as I predicted...

> I have complete faith in the Microsoft Edge team and absolutely expect support to arrive within the next few months.
>
> — Jon Neal (August, 2015)

All of our [dreams came true].

## Readability and accessibility

SVGs are compelling to use for many reasons, and one of them is their ease of accessibility.

Within your spritemap, have each sprite use a `<title>` element to identify itself.

```html
<symbol id="codepen">
	<title>CodePen</title>
	<path etc.../>
</symbol>
```

When this sprite is used, its title will be read aloud in [JAWS](http://www.freedomscientific.com/products/fs/JAWS-product-page.asp) and [NVDA](http://www.nvaccess.org/). Then, within your document, each sprite may use a `title` attribute to identify itself.

```html
<svg title="CodePen">
	<use xlink:href="map.svg#codepen"/>
</svg>
```

That title will be read aloud in [VoiceOver](http://www.apple.com/accessibility/osx/voiceover/) and [NVDA](http://www.nvaccess.org/). At present, the `title` attribute is the only way to properly read aloud an SVG in VoiceOver. I’ll let you know if this changes.

All together, **use the `title` attribute in your document and the `title` element in your SVG**.

ARIA roles may also be used to provide even more information to assistive technology.

When a sprite is merely decoration, use `role="presentation"`.

```html
<a href="//twitter.com/jon_neal"><svg role="presentation">
	<use xlink:href="map.svg#twitter"/>
</svg> Find me on Twitter</a>
```

Otherwise, use `role="img"` and remember to add a description.

```html
<a href="//twitter.com/jon_neal"><svg title="Find me on Twitter" role="img">
	<use xlink:href="map.svg#twitter"/>
</svg></a>
```

### Futher reading

- [Tips for creating accessible SVG](https://www.sitepoint.com/tips-accessible-svg/)
- [Using ARIA to enhance SVG accessibility](http://blog.paciellogroup.com/2013/12/using-aria-enhance-svg-accessibility/)
- [SVG symbol a good choice for icons](http://css-tricks.com/svg-symbol-good-choice-icons/)
- [Implementing inline SVG Icons](https://kartikprabhu.com/article/inline-svg-icons)

## Optimized SVGs

SVG files, especially exported from vector tools, often contain tons of unnecessary data such as editor metadata, comments, hidden elements, and other stuff that can be safely removed without affecting SVG rendering result.

Use a tool like [SVGO] to optimize SVG spritemaps.

```bash
$ [sudo] npm install -g svgo
$ svgo spritemap.svg
```

[ci]:      https://travis-ci.org/jonathantneal/svg4everybody
[ci-img]:  https://img.shields.io/travis/jonathantneal/svg4everybody.svg
[npm]:     https://www.npmjs.com/package/svg4everybody
[npm-img]: https://img.shields.io/npm/v/svg4everybody.svg

[all browsers]: http://caniuse.com/svg
[David Storey]: https://twitter.com/dstorey/status/626514631884804096
[dreams came true]: https://dev.windows.com/en-us/microsoft-edge/platform/changelog/desktop/10586/?compareWith=10240
[SVG External Content]: http://css-tricks.com/svg-sprites-use-better-icon-fonts/##Browser+Support
[SVG for Everybody]: https://github.com/jonathantneal/svg4everybody
[SVGO]: https://github.com/svg/svgo
[track progress]: http://dev.modern.ie/platform/status/svgexternalcontent/?filter=f3e0000bf&search=svg
[vote for attention]: https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6263916-svg-external-content
[X-UA-Compatible]: http://www.modern.ie/en-us/performance/how-to-use-x-ua-compatible

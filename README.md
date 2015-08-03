# SVG for Everybody

[SVG for Everybody] adds [external content] support to [all browsers].

To use it now, include the script in your document.

```html
<script src="/path/to/svg4everybody.js"></script>
<script>svg4everybody(); // run it now or whenever you are ready</script>
```

_As of v2.0.0, you must the manually call `svg4everybody()`. If you are using an AMD/CommonJS dependency loader then you may call it within the callback closure._

To support IE 6-8 as well, the script needs to be included in the `<head>` in order to shiv the `<svg>` and `<use>` elements. For best results in IE, set [X-UA-Compatible] to `ie=edge`. This can be done with a response header from the server or the following HTML in the `<head>`.

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

This spritemap works fine in **Chrome**, **Safari 7.1+**, **Firefox**, and **Opera**. [SVG for Everybody] polyfills the experience in **Safari 3.2 - 7.0**, **IE 9+**, and **Edge 12**.

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

Note that IE 6-8 requires a trailing slash `/` when using a self-closing `<use>` element.

![3 SVG logos](http://i.imgur.com/87Npdzn.png)

Browsers not supporting SVG fallback to PNG images.

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

Fallback PNGs point to the same location as their corresponding SVGs, only with the `#` hash replaced by a `.` dot, and with an appended `.png` extension.

_If you do not wish to support browsers without SVG support, you can generate an optimized build to remove the bits of code that polyfill images with PNG fallbacks_

```sh
$ grunt build --legacy=false
```

## Implementation status

We’re still waiting on <s>Internet Explorer</s> Edge. [David Storey], its project manager assures us that native support for external content in SVGs is high on their interop checklist. You may [track progress] or [vote for attention] to this issue. I think it will land soon, but don’t quote me on anything.

> I have complete faith in the Microsoft Edge team and absolutely expect support to arrive within the next few months.
>
> — Jon Neal (August, 2015)

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

[all browsers]: http://caniuse.com/svg
[David Storey]: https://twitter.com/dstorey/status/626514631884804096
[external content]: http://css-tricks.com/svg-sprites-use-better-icon-fonts/##Browser+Support
[SVG for Everybody]: https://github.com/jonathantneal/svg4everybody
[SVGO]: https://github.com/svg/svgo
[track progress]: http://dev.modern.ie/platform/status/svgexternalcontent/?filter=f3e0000bf&search=svg
[vote for attention]: https://wpdev.uservoice.com/forums/257854-microsoft-edge-developer/suggestions/6263916-svg-external-content
[X-UA-Compatible]: http://www.modern.ie/en-us/performance/how-to-use-x-ua-compatible

## 2.1.8 (2017-04-18)

- Added: Support for [custom attribute on `use` elements](https://github.com/jonathantneal/svg4everybody/pull/155)

## 2.1.7 (2017-03-03)

- Updated: Fixing internal use tag in polyfill

## 2.1.6 (2017-03-01)

- Updated: Ensure the interval begins to run

## 2.1.5 (2017-02-28)

- Updated: Fix for infinite loop in validation with polyfill
- Updated: Fix for IFrame svg use issue in Edge

## 2.1.4 (2016-06-15)

- Added: Support for [nested `use` elements](https://github.com/jonathantneal/svg4everybody/pull/117)
- Updated: Test document

## 2.0.3 (2016-02-02)

- Added: No polyfilling of Edge 12.10547+
- Updated: Source with documentation
- Updated: Caching for fetched SVG elements
- Updated: Test document

## 2.0.2 (2016-02-02)

- Added: Use non-minified non-legacy version as main file
- Added: caching for elements
- Updated: project configuration and stricter linting
- Added: Test document
- Updated documentation

## 2.0.1 (2015-11-24)

- Fix infinite loop issue with invalid <use> tags
- Update documentation

## 2.0.0 (2015-08-01)

- Added: UMD pattern and `svg4everybody` method to activate shim
- Added: Grunt build process
- Added: Option to remove legacy code from Grunt
- Added: Option to manually shim SVG or External Content from the browser
- Added: Option to customize PNG fallback from the browser
- Updated: SVG External Content feature-deficient browser detection
- Updated: Exclusive activation on `<use>` children of `<svg>`
- Updated: Preservation of existing `viewbox` attribute for SVGs
- Updated: Preservation of existing `width` and `height` attributes for PNG fallbacks
- Updated: Many performance improvements for caching, AJAX, and polling

## 1.0.0 (2015-07-28)

- Initial release

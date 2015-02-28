#!/bin/bash
uglifyjs -c -m --comments "/! svg4everybody/" -- svg4everybody.ie8.js > svg4everybody.ie8.min.js
uglifyjs -c -m --comments "/! svg4everybody/" -- svg4everybody.js > svg4everybody.min.js

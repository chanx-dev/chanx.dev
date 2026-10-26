#!/usr/bin/env bash
# Stamp the stylesheet and script URLs in index.html with a hash of their contents, so a
# deploy never pairs new HTML with a stylesheet the browser cached from the last one.
# Run it before committing a change to styles.css or main.js.
set -euo pipefail
cd "$(dirname "$0")/.."
for f in styles.css main.js; do
  v=$(shasum -a 256 "$f" | cut -c1-10)
  perl -pi -e "s#/\Q$f\E(\?v=[0-9a-f]+)?\"#/$f?v=$v\"#g" index.html
done
grep -o '/\(styles\.css\|main\.js\)?v=[0-9a-f]*' index.html

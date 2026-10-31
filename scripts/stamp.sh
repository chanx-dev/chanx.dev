#!/usr/bin/env bash
# Stamp the stylesheet and script URLs in every page with a hash of their contents, so a
# deploy never pairs new HTML with a stylesheet the browser cached from the last one.
# Run it before committing a change to a stylesheet, main.js or a page.
set -euo pipefail
cd "$(dirname "$0")/.."
pages=(index.html errors/*.html)
for f in styles.css main.js errors/errors.css; do
  v=$(shasum -a 256 "$f" | cut -c1-10)
  perl -pi -e "s#/\Q$f\E(\?v=[0-9a-f]+)?\"#/$f?v=$v\"#g" "${pages[@]}"
done
grep -ho '/\(styles\.css\|main\.js\|errors/errors\.css\)?v=[0-9a-f]*' "${pages[@]}" | sort | uniq -c

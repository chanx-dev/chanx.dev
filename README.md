# chanx.dev

The landing page at [chanx.dev](https://chanx.dev): one static page that points to each
chanx implementation's docs.

- [chanx](https://github.com/chanx-dev/chanx) (Python): [python.chanx.dev](https://python.chanx.dev)
- [chanx-js](https://github.com/chanx-dev/chanx-js) (TypeScript): [js.chanx.dev](https://js.chanx.dev)
- [chanx-go](https://github.com/chanx-dev/chanx-go) (Go): [go.chanx.dev](https://go.chanx.dev)
- [chanx-kit](https://github.com/chanx-dev/chanx-kit): [kit.chanx.dev](https://kit.chanx.dev)

`errors/` holds one page per problem type a chanx server sends in error frames:
`https://chanx.dev/errors/validation-failed` and the rest are the RFC 9457 `type` URIs, so
each must keep resolving. GitHub Pages serves `errors/<name>.html` at the URL without
`.html`; a local preview needs the extension.

No build step. Preview with `python3 -m http.server` and open http://localhost:8000.
GitHub Pages serves `main` as is; `CNAME` holds the domain. After changing a stylesheet,
`main.js` or a page, run `scripts/stamp.sh` so browsers fetch the new files.

The demo videos in `assets/demo` and the brand files in `assets/brand` are copies from the
project repositories. Update them there first.

# chanx.dev

The landing page at [chanx.dev](https://chanx.dev): one static page that points to each
chanx implementation's docs.

- [chanx](https://github.com/chanx-dev/chanx) (Python): [python.chanx.dev](https://python.chanx.dev)
- [chanx-js](https://github.com/chanx-dev/chanx-js) (TypeScript): [js.chanx.dev](https://js.chanx.dev)
- [chanx-go](https://github.com/chanx-dev/chanx-go) (Go): [go.chanx.dev](https://go.chanx.dev)
- [chanx-kit](https://github.com/chanx-dev/chanx-kit): [kit.chanx.dev](https://kit.chanx.dev)

No build step. Preview with `python3 -m http.server` and open http://localhost:8000.
GitHub Pages serves `main` as is; `CNAME` holds the domain. After changing
`styles.css` or `main.js`, run `scripts/stamp.sh` so browsers fetch the new files.

The demo videos in `assets/demo` and the brand files in `assets/brand` are copies from the
project repositories. Update them there first.

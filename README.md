[![Netlify Status](https://api.netlify.com/api/v1/badges/b9d10ab0-f74b-4974-b253-8b3d11e817e0/deploy-status)](https://app.netlify.com/sites/composableforms/deploys)

# Composable Form Specification documentation

A static HTML, CSS, and JavaScript documentation site. Node.js 22 or newer is required for the small build script; there are no package dependencies or Python requirements.

## Develop

```sh
npm run dev
```

Open http://localhost:8000/. The server rebuilds when pages, templates, navigation, or assets change. Refresh the browser to see changes.

## Edit

- `docs/pages/`: HTML page content, including stable heading IDs and permalink links.
- `templates/page.html`: shared page shell, header, sidebar, footer, and search dialog.
- `navigation.json`: page titles, grouping, and previous/next order.
- `assets/site.css` and `assets/site.js`: responsive styling and native browser interactions.

Use `{{root}}/user/form/` for links to another page from HTML content. The build replaces `{{root}}` with the correct relative prefix, so deployment also works under a subdirectory. Existing page URLs and heading IDs are preserved. The build derives the table of contents and search index from HTML content. Documentation and navigation render without JavaScript; search, mobile navigation, code highlighting, and section tracking use JavaScript.

## Build and verify

```sh
npm run build
npm test
```

The build recreates `site/`. Serve or publish that directory with any static host. Do not edit generated files there.

## Deploy

Netlify deploys pushes to `main`; `netlify.toml` sets the build command and publish directory. No MkDocs configuration is needed. The site retains the original Cinder appearance using a small custom stylesheet and uses the same hosted Open Sans, PT Sans, and Hack fonts with local system fallbacks.

See [CONTRIBUTING.md](CONTRIBUTING.md).

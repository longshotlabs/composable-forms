# Contributing

Use Node.js 22 or newer. Run `npm run dev`, then open http://localhost:8000/.

Edit the HTML content in `docs/pages/`, the shared shell in `templates/page.html`, and the styles and browser behavior in `assets/`. Add or reorder pages in `navigation.json`. Keep heading IDs stable so external links continue to work; include the existing permalink markup when adding headings. Headings at levels 1–3 appear in the sidebar automatically.

Internal cross-page links should start with `{{root}}/`, followed by the published route (for example, `{{root}}/spec/form/#implementation`). Same-page anchors can use `#heading-id`. Escape markup inside code examples using `&lt;`, `&gt;`, and `&amp;`.

Run `npm test` before submitting. It builds the site and checks every internal route, fragment link, and asset reference, including deployment under a URL prefix. Review affected pages at desktop and mobile widths.

The generated `site/` directory is ignored by Git and replaced on every build.

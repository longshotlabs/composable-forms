document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
menu.addEventListener('click', () => {
  const open = document.querySelector('#navigation').classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
const dropdowns = [...document.querySelectorAll('.dropdown')];
for (const dropdown of dropdowns) dropdown.addEventListener('toggle', () => {
  if (dropdown.open) for (const other of dropdowns) if (other !== dropdown) other.open = false;
});
document.addEventListener('click', (event) => {
  for (const dropdown of dropdowns) if (!dropdown.contains(event.target)) dropdown.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') for (const dropdown of dropdowns) if (dropdown.open) {
    dropdown.open = false;
    dropdown.querySelector('summary').focus();
  }
});
const toc = [...document.querySelectorAll('.sidebar li a')];
const headings = [...document.querySelectorAll('main h1[id], main h2[id], main h3[id]')];
let scheduled = false;
function highlightSection() {
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
  let current = headings[0];
  for (const heading of headings) if (heading.getBoundingClientRect().top <= offset + 10) current = heading;
  for (const link of toc) {
    if (link.hash === `#${current?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(highlightSection); } }, { passive: true });
highlightSection();

const dialog = document.querySelector('#search-dialog');
const query = document.querySelector('#search-query');
const results = document.querySelector('#search-results');
const siteRoot = new URL('../', import.meta.url);
let searchIndex;
let searchRevision = 0;
async function search() {
  const revision = ++searchRevision;
  results.replaceChildren();
  const terms = query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return;
  try {
    searchIndex ??= fetch(new URL('assets/search.json', siteRoot)).then((response) => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json();
    });
    const index = await searchIndex;
    // Render only the latest query if input changed during the fetch.
    if (revision !== searchRevision) return;
    const matches = index.filter((page) => terms.every((term) => `${page.title} ${page.text}`.toLowerCase().includes(term)))
      .sort((a, b) => Number(terms.every((term) => b.title.toLowerCase().includes(term))) - Number(terms.every((term) => a.title.toLowerCase().includes(term))));
    for (const page of matches) {
      const article = document.createElement('article');
      const link = document.createElement('a');
      link.href = new URL(page.url, siteRoot).href;
      link.textContent = page.title;
      const excerpt = document.createElement('p');
      const position = Math.max(0, page.text.toLowerCase().indexOf(terms[0]) - 60);
      excerpt.textContent = `${position ? '…' : ''}${page.text.slice(position, position + 220)}…`;
      article.append(link, excerpt);
      results.append(article);
    }
    if (!matches.length) results.textContent = 'No results found.';
  } catch {
    if (revision !== searchRevision) return;
    searchIndex = undefined;
    results.textContent = 'Search could not load. Please try again.';
  }
}
document.querySelector('.search-toggle').addEventListener('click', () => { dialog.showModal(); query.focus(); search(); });
document.querySelector('.close-search').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog && (event.clientX < dialog.getBoundingClientRect().left || event.clientX > dialog.getBoundingClientRect().right || event.clientY < dialog.getBoundingClientRect().top || event.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
query.addEventListener('input', search);

// Highlight code through DOM text nodes so examples remain safe, editable HTML.
for (const code of document.querySelectorAll('pre code.language-js, pre code.language-javascript')) {
  const text = code.textContent;
  const tokens = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|\b(const|let|var|function|return|import|from|export|default|new|if|else|true|false|null|undefined|class|extends|this|throw|async|await)\b|\b(\d+(?:\.\d+)?)\b/g;
  const fragment = document.createDocumentFragment();
  let start = 0;
  for (const match of text.matchAll(tokens)) {
    fragment.append(text.slice(start, match.index));
    const span = document.createElement('span');
    span.className = `syntax-${match[1] ? 'string' : match[2] ? 'comment' : match[3] ? 'keyword' : 'number'}`;
    span.textContent = match[0];
    fragment.append(span);
    start = match.index + match[0].length;
  }
  fragment.append(text.slice(start));
  code.replaceChildren(fragment);
}

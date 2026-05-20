# CSR vs SSG vs SSR

- [CSR vs SSG vs SSR](#csr-vs-ssg-vs-ssr)
  - [Summary](#summary)
  - [CSR — Client-Side Rendering](#csr--client-side-rendering)
  - [SSR — Server-Side Rendering (getServerSideProps)](#ssr--server-side-rendering-getserversideprops)
  - [SSG — Static-Site Generation (getStaticProps)](#ssg--static-site-generation-getstaticprops)
    - [createRoot() vs hydrateRoot()](#createroot-vs-hydrateroot)
  - [Virtual DOM vs RealDOM](#virtual-dom-vs-realdom)
  - [Quiz - CSR (Client-Side Rendering)](#quiz---csr-client-side-rendering)
  - [Quiz - SSG (Static Site Generation)](#quiz---ssg-static-site-generation)
  - [Quiz - SSR (Server-Side Rendering)](#quiz---ssr-server-side-rendering) - [Summary](#summary-1)

## Summary

- CSR: Browser: receives **empty shell** from the server → createRoot().render() → builds DOM from scratch
- SSR/SSG: Browser: receives **pre-built HTML** from the server → Next.js calls hydrateRoot() → interactive

- CSR: The browser receives an empty HTML shell, then createRoot().render() builds the DOM from scratch on the client.

- SSR/SSG: The browser receives pre-built HTML from the server, then hydrateRoot() makes it interactive.

## CSR — Client-Side Rendering

- **"The browser does all the work."**
- React ships a nearly empty HTML file + a JavaScript bundle.
- When a user accesses the site, the browser downloads the JS and React mounts the app using `createRoot()`.
- `Server → sends empty HTML + JS bundle → Browser runs JS → Page appears`
- `Browser: receives empty shell → createRoot().render() → builds DOM from scratch`

**CSR vs SSR vs SSG**

|                    | CSR              | SSR                  | SSG                 |
| ------------------ | ---------------- | -------------------- | ------------------- |
| **HTML built**     | In browser       | On each request      | At build time       |
| **SEO**            | ❌ Poor          | ✅ Great             | ✅ Great            |
| **Initial load**   | Slow             | Fast                 | Fastest             |
| **Data freshness** | Always fresh     | Always fresh         | Stale until rebuild |
| **Server cost**    | Low              | High                 | Near zero           |
| **Best for**       | Dashboards, SPAs | Dynamic public pages | Static content      |

## SSR — Server-Side Rendering (getServerSideProps)

- **"The server builds the HTML on every request."**
- Request time: getServerSideProps → renderToString() → sends fresh HTML
- Browser: receives HTML → Next.js calls hydrateRoot() → interactive

## SSG — Static-Site Generation (getStaticProps)

- **"HTML is built once at deploy time."**
- `Browser:     sends pre-built HTML → Next.js calls hydrateRoot() → interactive`
- The server runs React at build time, not request time.
- A Claims page - https://ai.hirokoymj.com/claims
- About page - https://ai.hirokoymj.com/about

### createRoot() vs hydrateRoot()

- `createRoot()` - used in CSR. React builds the DOM from scratch in the browser. There is no pre-existing HTML to work with.
- `hydrateRoot()` - used in SSR/SSG. The server already sent real HTML, so React attaches event listeners to the existing HTML instead of rebuilding it. This is called hydration.

```js
// CSR — builds DOM from nothing
createRoot(document.getElementById('root')).render(<App />);

// SSR/SSG — HTML already exists, React "wakes it up"
hydrateRoot(document.getElementById('root'), <App />);
```

## Virtual DOM vs RealDOM

The Virtual DOM is a lightweight, in-memory copy of the real DOM that React uses to calculate what changed — the real DOM is the actual HTML elements the browser renders on screen.

## Quiz - CSR (Client-Side Rendering)

- What is CSR and how does it differ from server-rendered approaches?

> CSR sends an empty HTML shell to the browser, and JavaScript builds all the content on the client; SSR/SSG send pre-built HTML from the server so content is visible immediately.

- What are the SEO challenges with CSR, and how do you mitigate them?

  > Search crawlers may see an empty page before JavaScript runs, so you mitigate this by switching public pages to SSR or SSG, or using a prerendering service.

- How does the initial page load performance compare between CSR and SSR?

  > SSR is faster on first load because the browser receives ready-to-paint HTML, while CSR must download and execute JavaScript before any content appears.

- How does React hydration relate to CSR?
  > Hydration is when React attaches event listeners to existing HTML — in CSR, createRoot() builds the DOM from scratch, while hydrateRoot() is used in SSR to attach to server-rendered HTML.

## Quiz - SSG (Static Site Generation)

- What is SSG and what problem does it solve?

> SSG pre-builds all HTML at build time so every request is served instantly from a CDN, solving slow initial loads and poor SEO from CSR.

- In Next.js, what is getStaticProps and when does it run?

  > getStaticProps runs once on the server at build time to fetch data and pass it as props to the page.

- What are the limitations of SSG? (stale data, dynamic content)

  > Since HTML is built once at deploy time, any data change requires a full rebuild, making it unsuitable for frequently updated or real-time content.

## Quiz - SSR (Server-Side Rendering)

- What is SSR and what happens on each request?

  > On every request, the server fetches fresh data, renders the full HTML, and sends it to the browser — so content is always up to date.

- In Next.js, what is getServerSideProps and how is it different from getStaticProps?

> getServerSideProps runs on every request at runtime to return fresh data, while getStaticProps runs only once at build time and the data can become stale.

- What are the performance trade-offs of SSR vs SSG?
  > SSG is faster because pages are pre-built and cached on a CDN, while SSR always returns fresh data but adds server processing time on every request.

#### Summary

- CSR sends an **empty HTML shell** to the browser, and JavaScript builds all the content on the client; SSR/SSG send **pre-built HTML** from the **server** so content is **visible immediately**.
- In CSR, `createRoot` builds the DOM from scratch, while hydrateRoot() is used in SSR to attach to server-rendered HTML.

- Hydration is when React attaches event listeners to existing HTML — in CSR, createRoot() builds the DOM from scratch,

function isFrameEmbeddingAllowed(pathname) {
  return pathname === "/partners-embed" || pathname === "/sponsors-embed" || pathname === "/stats/npm/embed";
}
const allowsFrameEmbedding = isFrameEmbeddingAllowed;
const docsContentNegotiationVaryHeader = "Accept, Accept-Encoding, Sec-Fetch-Dest, Sec-Fetch-Mode";
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
};
const GOOGLE_ANALYTICS_SCRIPT_URL = "https://www.googletagmanager.com/gtag/js?id=G-JMT1Z50SPS";
const GOOGLE_ANALYTICS_COLLECT_URL = "https://www.google-analytics.com/g/collect";
const SCARF_EVENTS_URL = "https://tanstack.gateway.scarf.sh/site-events";
const MAX_CLIPBOARD_EVENT_BYTES = 4096;
const STATIC_RESPONSE_LINK_HEADERS = {
  filter: ({ phase }) => phase === "static"
};
function isBrowserDocumentRequest(request) {
  return request.headers.get("Sec-Fetch-Dest") === "document" || request.headers.get("Sec-Fetch-Mode") === "navigate";
}
function shouldRewriteDocsRequestToMarkdown(request, url) {
  const acceptHeader = request.headers.get("Accept") || "";
  return acceptHeader.includes("text/markdown") && url.pathname.includes("/docs/") && !url.pathname.endsWith(".md") && !isBrowserDocumentRequest(request);
}
function applyHostingHeaders(response, url) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  if (isFrameEmbeddingAllowed(url.pathname)) {
    headers.delete("X-Frame-Options");
  }
  if (url.pathname === "/builder" || url.pathname.startsWith("/builder/")) {
    headers.set("Cross-Origin-Opener-Policy", "same-origin");
    headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
function getAnalyticsProxyHeaders(request) {
  const headers = new Headers();
  for (const headerName of ["accept", "accept-language", "user-agent"]) {
    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  return headers;
}
async function proxyAnalyticsRequest(request, url, transport = fetch) {
  const upstreamUrl = url.pathname === "/_a/gtag.js" ? new URL(GOOGLE_ANALYTICS_SCRIPT_URL) : url.pathname === "/_a/g/collect" ? new URL(GOOGLE_ANALYTICS_COLLECT_URL) : null;
  if (!upstreamUrl) {
    return null;
  }
  if (url.pathname === "/_a/g/collect") {
    upstreamUrl.search = url.search;
  }
  const init = {
    method: request.method,
    headers: getAnalyticsProxyHeaders(request),
    redirect: "follow"
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    Object.assign(init, { duplex: "half" });
  }
  const response = await transport(upstreamUrl, init);
  return applyHostingHeaders(response, url);
}
async function proxyScarfClipboardEvent(request, url, transport = fetch) {
  if (url.pathname !== "/_a/scarf/clipboard") return null;
  if (request.method !== "POST" || request.headers.get("content-type") !== "application/json" || Number(request.headers.get("content-length")) > MAX_CLIPBOARD_EVENT_BYTES) {
    return applyHostingHeaders(new Response(null, { status: 400 }), url);
  }
  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).length > MAX_CLIPBOARD_EVENT_BYTES) {
    return applyHostingHeaders(new Response(null, { status: 400 }), url);
  }
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return applyHostingHeaders(new Response(null, { status: 400 }), url);
  }
  if (typeof body !== "object" || body === null || !("event" in body) || body.event !== "copy" && body.event !== "paste" || !("page" in body) || typeof body.page !== "string" || !body.page.startsWith("/") || body.page.length > 512 || !("text" in body) || typeof body.text !== "string" || body.text.length > 512 || !("truncated" in body) || typeof body.truncated !== "boolean") {
    return applyHostingHeaders(new Response(null, { status: 400 }), url);
  }
  const headers = new Headers({ "Content-Type": "application/json" });
  for (const headerName of ["user-agent", "dnt", "sec-gpc"]) {
    const value = request.headers.get(headerName);
    if (value) headers.set(headerName, value);
  }
  const clientIp = request.headers.get("cf-connecting-ip");
  if (clientIp) headers.set("X-Scarf-IP", clientIp);
  try {
    await transport(SCARF_EVENTS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        event: body.event,
        page: body.page,
        text: body.text,
        truncated: body.truncated
      })
    });
  } catch {
  }
  return applyHostingHeaders(new Response(null, { status: 204 }), url);
}
export {
  SECURITY_HEADERS,
  allowsFrameEmbedding,
  applyHostingHeaders,
  docsContentNegotiationVaryHeader,
  isFrameEmbeddingAllowed,
  proxyAnalyticsRequest,
  proxyScarfClipboardEvent,
  shouldRewriteDocsRequestToMarkdown
};

// Pinned docs.functions.ts setDocsCacheHeaders overrides the route browser TTL
// after a successful content load. Native published docs need the same final
// response policy without performing a redundant content server-function call.
export function applyPublishedDocumentResponseHeaders(headers){headers.set('Cache-Control','public, max-age=0, must-revalidate');return headers;}

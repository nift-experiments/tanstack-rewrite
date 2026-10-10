// The official Start serializer invokes this request-scoped HTTP transport.
// No backend implementation enters the publication renderer's import graph.
export function createSsrServiceTransport(request, dispatch, receiveCookie = () => {}) {
  const responseHeaders=new Headers();
  return {
    responseHeaders,
    request,
    async fetch(url, init = {}) {
      const destination = new URL(url, request.url);
      if (destination.origin !== new URL(request.url).origin ||
          !destination.pathname.startsWith('/_serverFn/')) {
        throw Error('SSR service transport requires a same-origin server-function URL');
      }
      const headers = new Headers(init.headers);
      for (const name of ['cookie', 'authorization', 'origin', 'host']) {
        const value = request.headers.get(name);
        if (value !== null && !headers.has(name)) headers.set(name, value);
      }
      // This call is initiated by trusted SSR code, rather than a browser RPC.
      // Keep the backend's real CSRF middleware enabled and give internal calls
      // without an Origin the verified same-origin destination. Browser RPCs
      // continue through the ordinary HTTP bridge without this adaptation.
      if (!headers.has('origin')) headers.set('origin', destination.origin);
      const signal = init.signal
        ? AbortSignal.any([request.signal, init.signal])
        : request.signal;
      const response = await dispatch(new Request(destination, {...init, headers, signal}));
      for(const name of ['cache-control','cloudflare-cdn-cache-control','vary']){const value=response.headers.get(name);if(value!==null)responseHeaders.set(name,value);}
      for (const cookie of response.headers.getSetCookie()) receiveCookie(cookie);
      return response;
    },
  };
}

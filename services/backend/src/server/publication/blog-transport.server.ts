// Optional host transport boundary. Default preserves the original public feed
// request; the parity harness can provide the same captured upstream response.
let transport:typeof fetch|undefined
export function configureExternalBlogTransport(value:typeof fetch|undefined){transport=value}
export function fetchExternalBlogFeed(input:RequestInfo|URL,init?:RequestInit){return (transport??globalThis.fetch)(input,init)}

export function applicationPublicationKey(pattern:string) {
  return pattern.replace(/[^a-zA-Z0-9_-]+/g,'_').replace(/^_+/,'')
}

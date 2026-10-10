let assetURLs:Readonly<Record<string,string>>={}
export function initializePublicationURLs(values:Record<string,string>,base:string){assetURLs=Object.freeze(Object.fromEntries(Object.entries(values).map(([key,value])=>[key,key==='/'?'/':new URL(value,base).pathname.replace(key.endsWith('.html')?/a^/:/\.html$/,'')])))}
export function publicationAssetURL(value:any){if(typeof value!=='string'||typeof document==='undefined')return value;const split=value.search(/[?#]/),base=split<0?value:value.slice(0,split),suffix=split<0?'':value.slice(split);return assetURLs[base]?assetURLs[base]+suffix:value}
export function publicationSrcset(value:any){return typeof value==='string'?value.replace(/(?:^|,\s*)([^\s,]+)/g,(full,url)=>full.replace(url,publicationAssetURL(url))):value}

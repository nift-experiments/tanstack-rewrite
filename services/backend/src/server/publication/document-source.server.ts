export type PublicationDocumentSource={read:(repo:string,ref:string,filepath:string)=>Promise<string|null|undefined>;bytes?:(repo:string,ref:string,filepath:string)=>Promise<Uint8Array|null|undefined>;owns:(repo:string,ref:string,filepath?:string)=>boolean;revision?:(repo:string,ref:string)=>string|undefined;tree?:(repo:string,ref:string,path:string)=>Array<{path:string;type:'blob'|'tree';size?:number;sha?:string}>|undefined}
let source:PublicationDocumentSource|undefined
export function configurePublicationDocumentSource(value:PublicationDocumentSource){source=value}
export function readPublicationDocumentSource(repo:string,ref:string,filepath:string){return source?.read(repo,ref,filepath)}
export function ownsPublicationRepository(repo:string,ref:string,filepath?:string){return source?.owns(repo,ref,filepath)??false}

export function readPublicationDocumentTree(repo:string,ref:string,path:string){return source?.tree?.(repo,ref,path)}

export function readPublicationRevision(repo:string,ref:string){return source?.revision?.(repo,ref)}

export function readPublicationSourceBytes(repo:string,ref:string,filepath:string){return source?.bytes?.(repo,ref,filepath)}

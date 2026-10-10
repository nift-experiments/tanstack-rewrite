export type PublicationDocumentSource={read:(repo:string,ref:string,filepath:string)=>Promise<string|null|undefined>;owns:(repo:string,ref:string,filepath?:string)=>boolean;tree?:(repo:string,ref:string,path:string)=>Array<{path:string;type:'blob'|'tree'}>|undefined}
let source:PublicationDocumentSource|undefined
export function configurePublicationDocumentSource(value:PublicationDocumentSource){source=value}
export function readPublicationDocumentSource(repo:string,ref:string,filepath:string){return source?.read(repo,ref,filepath)}
export function ownsPublicationRepository(repo:string,ref:string,filepath?:string){return source?.owns(repo,ref,filepath)??false}

export function readPublicationDocumentTree(repo:string,ref:string,path:string){return source?.tree?.(repo,ref,path)}

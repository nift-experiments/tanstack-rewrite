import {runWithHostRuntimeEnv,runWithHostRuntimeContext} from 'backend-src/server/runtime/host.server'
import {configureExternalBlogTransport} from 'backend-src/server/publication/blog-transport.server'
import {configurePublicationDocumentSource} from 'backend-src/server/publication/document-source.server'
import {createStartHandler} from '@tanstack/react-start/server';
import {runWithDatabaseRequest,runWithDatabaseContext} from 'backend-src/db/client';
const handler=createStartHandler(()=>new Response('API boundary only',{status:404}));
export default {
 configurePublicationDocumentSource,configureExternalBlogTransport,
 fetch:(request:Request,env?:unknown,context?:unknown)=>runWithHostRuntimeEnv(env,()=>runWithHostRuntimeContext(context,()=>runWithDatabaseRequest(()=>handler(request)))),
 async readBlogIndex(){const {readBlogIndexProjection}=await import('backend-src/utils/blog.functions');return readBlogIndexProjection()},
 async readUser(request:Request){const {getAuthService}=await import('backend-src/auth/index.server');return runWithDatabaseContext(()=>getAuthService().getCurrentUser(request))},
}

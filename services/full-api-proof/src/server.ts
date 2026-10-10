import {createStartHandler} from '@tanstack/react-start/server';
import {runWithDatabaseRequest,runWithDatabaseContext} from 'backend-src/db/client';
const handler=createStartHandler(()=>new Response('API boundary only',{status:404}));
export default {
 fetch:(request:Request)=>runWithDatabaseRequest(()=>handler(request)),
 async readUser(request:Request){const {getAuthService}=await import('backend-src/auth/index.server');return runWithDatabaseContext(()=>getAuthService().getCurrentUser(request))},
}

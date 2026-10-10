import {createStartHandler} from '@tanstack/react-start/server';
export default {
 fetch:createStartHandler(()=>new Response('API boundary only',{status:404})),
 async readUser(request:Request){const {getAuthService}=await import('backend-src/auth/index.server');return getAuthService().getCurrentUser(request)},
}

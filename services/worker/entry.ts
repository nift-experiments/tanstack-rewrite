// Runtime classes keep their original state/storage protocols. The API artifact
// is compiled independently through the official server-function transform.
export {StreamObject} from '@durable-streams/server-cloudflare'
export {WorkspaceSync} from '../backend/src/chat/server/workspace-sync-object'
export {Conversation} from '../backend/src/chat/server/conversation'
export {TanChatWorkflow} from '../backend/src/chat/server/workflow-driver'
import api from '../../.work/worker-api-prototype/dist/server/index.js'
export default {fetch:(request:Request,env:unknown,context:unknown)=>api.fetch(request,env,context)}

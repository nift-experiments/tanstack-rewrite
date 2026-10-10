// Explicit external transport fixture. Auth, SQL, durable objects, workflows,
// provider adapters, tool execution and transcripts remain real application code.
export const modelFixtureHost='provider.rewrite-fixture.invalid';
export function modelTransportFixture(fallback){return async request=>{
 const url=new URL(request.url);if(url.hostname!==modelFixtureHost)return fallback(request);
 if(request.method!=='POST'||!url.pathname.endsWith('/chat/completions'))return new Response('Uncaptured provider fixture operation',{status:404});
 const body=await request.json(),toolModel=body.model==='rewrite-fixture-tool-model';
 if(body.model!=='rewrite-fixture-model'&&!toolModel)return new Response('Uncaptured model',{status:400});
 const callTool=toolModel&&!body.messages?.some(message=>message.role==='tool'&&message.tool_call_id==='fixture_list_files');
 const toolName=body.tools?.some(tool=>tool.function?.name==='list_files')?'list_files':'load_tools';
 if(callTool&&!body.tools?.some(tool=>tool.function?.name===toolName))return new Response('Required retained fixture tool is unavailable',{status:400});
 const text=toolModel?'Retained tool fixture response.':'Retained conversation fixture response.';
 const toolCall={id:'fixture_'+toolName,type:'function',function:{name:toolName,arguments:toolName==='list_files'?'{}':JSON.stringify({names:['list_files']})}};
 const message=callTool?{role:'assistant',content:null,tool_calls:[toolCall]}:{role:'assistant',content:text};
 const finish=callTool?'tool_calls':'stop',usage={prompt_tokens:10,completion_tokens:8,total_tokens:18};
 if(!body.stream)return Response.json({id:'rewrite-fixture-completion',object:'chat.completion',created:1,model:body.model,choices:[{index:0,message,finish_reason:finish}],usage});
 const delta=callTool?{role:'assistant',tool_calls:[{index:0,...toolCall}]}:{role:'assistant',content:text};
 const chunks=[{choices:[{index:0,delta,finish_reason:null}]},{choices:[{index:0,delta:{},finish_reason:finish}],usage}];
 return new Response(chunks.map(chunk=>'data: '+JSON.stringify({id:'rewrite-fixture-completion',object:'chat.completion.chunk',created:1,model:body.model,...chunk})+'\n\n').join('')+'data: [DONE]\n\n',{headers:{'content-type':'text/event-stream'}});
}}

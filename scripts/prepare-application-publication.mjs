import {applicationDefinitions} from '../.work/publication-ssr/index.mjs';

// Dynamic application data is evaluated at request time. Nift publishes each
// family's native boundary and the shared document envelope; preview never
// manufactures publication files. These are family contracts, not page counts.
export function prepareApplicationPublication(tracked,write) {
  const definitions=applicationDefinitions().filter(record=>record.leaf);
  const keys=new Set();
  for(const definition of definitions){
    if(keys.has(definition.publicationKey))throw Error('Application publication key collision '+definition.pattern);
    keys.add(definition.publicationKey);
    write('content/publication-applications/'+definition.publicationKey+'.html','<div data-application-source style="display:contents"><div data-application-island style="display:contents"></div></div>');
    tracked.push({name:'publication-applications/'+definition.publicationKey,title:definition.pattern,template:'templates/corpus-raw.html'});
  }
  write('content/application-envelope.html','<!--REQUEST_SHELL_START--><div data-published-region style="display:contents"></div><!--REQUEST_SHELL_END-->');
  write('templates/application-envelope.html','<!doctype html><html lang="en" class="dark"><head><!--REQUEST_HEAD_START--><!--REQUEST_HEAD_END-->@input("templates/page-head.html")</head><body class="overflow-x-hidden"><!--REQUEST_CONTEXT_START--><script type="application/json" id="shell-request-context">{}</script><!--REQUEST_CONTEXT_END--><div id="shell" data-ssr="true">@content</div></body></html>');
  tracked.push({name:'application-envelope',title:'Request-time application document',template:'templates/application-envelope.html'});
  return definitions;
}

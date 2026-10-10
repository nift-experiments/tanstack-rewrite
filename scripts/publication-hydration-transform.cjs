module.exports=function({types:t}){return {visitor:{
 Program:{enter(path){path.setData('publicationPortalUsed',false)},exit(path){if(path.getData('publicationPortalUsed'))path.unshiftContainer('body',t.importDeclaration([t.importSpecifier(t.identifier('__publicationPortal'),t.identifier('publicationPortal'))],t.stringLiteral('owned-publication/PublicationHydrate')))}},
 ImportDeclaration(path,state){
  if(state.filename?.endsWith('/PublicationHydrate.tsx')||path.node.source.value!=='@tanstack/react-start')return;
  const specifiers=path.node.specifiers.filter(spec=>t.isImportSpecifier(spec)&&spec.imported.name==='Hydrate'&&spec.importKind!=='type');
  if(!specifiers.length)return;
  path.node.specifiers=path.node.specifiers.filter(spec=>!specifiers.includes(spec));
  path.insertAfter(t.importDeclaration(specifiers,t.stringLiteral('owned-publication/PublicationHydrate')));
  if(!path.node.specifiers.length)path.remove();
 },
 CallExpression(path){
  if(!t.isIdentifier(path.node.callee)||!path.node.arguments.length)return;
  const binding=path.scope.getBinding(path.node.callee.name);
  if(!binding?.path.isImportSpecifier()||binding.path.node.imported.name!=='createPortal'||binding.path.parent.source.value!=='react-dom')return;
  path.node.arguments[0]=t.callExpression(t.identifier('__publicationPortal'),[path.node.arguments[0],path.node.arguments[1]]);path.findParent(parent=>parent.isProgram()).setData('publicationPortalUsed',true);
 }
}}}

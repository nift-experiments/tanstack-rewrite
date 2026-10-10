// Compact behavioral metadata only: never serialize the document AST or body.
export function projectArticleControls(document, preferredFramework='react') {
 const groups=[]
 const add=spec=>groups.push({index:groups.length,...spec})
 const visit=node=>{
  if(!node||typeof node!=='object')return
  if(node.type==='component'&&node.name==='framework'){
   const panels=(node.children??[]).filter(child=>child.name==='framework-panel')
   const active=panels.find(panel=>panel.properties?.['data-framework']===preferredFramework)??panels[0]
   if(active)for(const child of active.children??[])visit(child)
   return
  }
  if(node.type==='component'&&node.name==='tabs'){
   const props=node.properties??{}
   if(props['data-package-manager-meta']){
    const meta=JSON.parse(props['data-package-manager-meta'])
    const frameworks=Object.keys(meta.packagesByFramework)
    const framework=frameworks.includes(preferredFramework)?preferredFramework:frameworks[0]
    if(framework)add({storageKey:'packageManager',defaultValue:'npm',values:['npm','pnpm','yarn','bun'],displayClass:'flex',installCopy:['install','dev-install','local-install'].includes(meta.mode)?{framework,packages:meta.packagesByFramework[framework].flat().join(',')}:undefined})
    return
   }
   const tabs=JSON.parse(props['data-attributes']??'{}').tabs??[]
   const bundler=Boolean(props['data-bundler-meta'])
   const values=tabs.map(tab=>tab.slug).filter(slug=>!bundler||['vite','rsbuild'].includes(slug))
   if(values.length)add({storageKey:bundler?'bundler':undefined,defaultValue:bundler&&values.includes('vite')?'vite':values[0],values,displayClass:props['data-files-meta']?'block':'flex'})
  }
  for(const child of node.children??[])visit(child)
 }
 visit(document)
 return groups
}

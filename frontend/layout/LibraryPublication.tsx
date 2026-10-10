import {useDocComponentRegistration} from 'owned-doc-components/DocComponents'
import React from 'react'
import {useParams} from '@tanstack/react-router'
import {getLibrary,getBranch} from 'retained-ui/libraries'
import {LibraryLayout} from 'retained-ui/components/LibraryLayout'
import {DocContainer} from 'retained-ui/components/DocContainer'
import {Scarf} from 'retained-ui/components/Scarf'
import {PublishedDoc} from './PublishedDoc'
import {useToast} from 'retained-ui/components/ToastProvider'
import {copyTextToClipboard} from 'retained-ui/utils/browser-effects'
import {installCodeCopy} from 'owned-publication/code-copy'
import {installArticleControls} from '../article-controls.js'
import {trackScarfInstallCommandCopy} from 'retained-ui/utils/analytics/scarf'
import {createClientOnlyFn} from '@tanstack/react-start'
const installDiagrams=createClientOnlyFn((host:HTMLDivElement)=>{
 let disposed=false
 let cleanup:(()=>void)|undefined
 if(host.querySelector('[data-island="mermaid"]'))import('owned-publication/mermaid').then(module=>{if(!disposed)cleanup=module.activateMermaid(host)}).catch(error=>console.error('Mermaid activation error',error))
 return ()=>{disposed=true;cleanup?.()}
})
export function LibraryPublication({html,record,config,activate}:{html:string;record:any;config:any;activate:(host:HTMLDivElement)=>void|(()=>void)}){
 const {libraryId,version,framework}=useParams({strict:false}) as any
 const library=getLibrary(libraryId)
 const {notify}=useToast()
 const registerComponents=useDocComponentRegistration()
 const activatePublication=React.useCallback((host:HTMLDivElement)=>{
  const stopComponents=registerComponents(host)
  const deactivate=activate(host)
  const groups=record.controls??[]
  const stopTabs=installArticleControls(host,groups)
  const stopDiagrams=installDiagrams(host)
  const lists=[...host.querySelectorAll('[role="tablist"]')]
  const stopCopy=installCodeCopy(host,copyTextToClipboard,notify,button=>{
   const group=groups.find((spec:any)=>spec.installCopy&&lists[spec.index]?.parentElement?.contains(button))
   if(group)trackScarfInstallCommandCopy(button.closest<HTMLElement>('[role="tabpanel"]')!.dataset.tab!,group.installCopy.framework,group.installCopy.packages)
  })
  return ()=>{stopDiagrams?.();stopTabs();stopCopy();deactivate?.();stopComponents()}
 },[activate,notify,record.controls,registerComponents])
 return <LibraryLayout libraryId={library.id} name={library.name.replace('TanStack ','')} version={version==='latest'?library.latestVersion:version} colorFrom={library.accentColorFrom??library.colorFrom} colorTo={library.accentColorTo??library.colorTo} textColor={library.accentTextColor??library.textColor??''} config={config} frameworks={library.frameworks} versions={library.availableVersions} repo={library.repo} isLandingPage={false}>
  <DocContainer><PublishedDoc key={record.filePath} title={record.title} html={html} headings={record.headings} repo={library.repo} branch={getBranch(library,version)} filePath={record.filePath} colorFrom={library.colorFrom} colorTo={library.colorTo} textColor={library.textColor} shouldRenderToc libraryId={libraryId} libraryVersion={version==='latest'?library.latestVersion:version} pagePath={record.pathname} config={config} framework={framework} activate={activatePublication}/></DocContainer>
  {library.scarfId?<Scarf id={library.scarfId} path={`/${library.id}`}/>:null}
 </LibraryLayout>
}

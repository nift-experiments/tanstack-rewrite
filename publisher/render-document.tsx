import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createRouter,createRootRoute,createRoute,createMemoryHistory,RouterContextProvider,Outlet} from '@tanstack/react-router'
import {FrameworkPreference} from '../frontend/components/FrameworkPreference'
import {Document} from './views/Document'
import {projectArticleControls} from './project-controls.mjs'
import {parseSiteMarkdown} from './upstream/src/utils/markdown/processor'
export async function renderDocumentProjection(source:string,pathname:string,preferences:{userFramework?:string;localFramework?:string}={},options:{feedbackWrapper?:boolean}={}){const body=source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');const document=parseSiteMarkdown(body);const root=createRootRoute({component:()=> <Outlet/>});const route=createRoute({getParentRoute:()=>root,path:'/$library/$version/docs/framework/$framework/$',component:()=> <Document document={document}/>});const router=createRouter({routeTree:root.addChildren([route,createRoute({getParentRoute:()=>root,path:'/$library/$version/docs/$',component:()=> <Document document={document}/>})]),history:createMemoryHistory({initialEntries:[pathname]}),isServer:true});await router.load();const html=renderToStaticMarkup(<RouterContextProvider router={router}><FrameworkPreference.Provider value={preferences}>{options.feedbackWrapper===false?<Document document={document}/>:<div className="relative"><Document document={document}/></div>}</FrameworkPreference.Provider></RouterContextProvider>);return {html,headings:document.headings,controls:projectArticleControls(document,(pathname.match(/\/docs\/framework\/([^/]+)/)?.[1]||preferences.userFramework||preferences.localFramework||'react').toLowerCase())}}

export async function renderDocument(...args:Parameters<typeof renderDocumentProjection>){return (await renderDocumentProjection(...args)).html}

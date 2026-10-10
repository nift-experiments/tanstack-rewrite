import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {createRouter,createRootRoute,createRoute,createMemoryHistory,RouterContextProvider,Outlet} from '@tanstack/react-router'
import {Document} from './views/Document'
import {parseSiteMarkdown} from './upstream/src/utils/markdown/processor'
export async function renderDocument(source:string,pathname:string){const body=source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');const document=parseSiteMarkdown(body);const root=createRootRoute({component:()=> <Outlet/>});const route=createRoute({getParentRoute:()=>root,path:'/$library/$version/docs/framework/$framework/$',component:()=> <Document document={document}/>});const router=createRouter({routeTree:root.addChildren([route]),history:createMemoryHistory({initialEntries:[pathname]}),isServer:true});await router.load();return renderToStaticMarkup(<RouterContextProvider router={router}><div className="relative"><Document document={document}/></div></RouterContextProvider>)}

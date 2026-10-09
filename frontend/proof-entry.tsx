import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {Tabs} from './components/Tabs'
const props=JSON.parse(document.querySelector('#tab-props')!.textContent!)
hydrateRoot(document.querySelector('#document-tabs')!,<Tabs tabs={props.tabs} panelContent={props.content}>{props.content.map((html:string,i:number)=><div key={i} dangerouslySetInnerHTML={{__html:html}}/>)}</Tabs>,{onRecoverableError(error){console.error(error)}})
document.documentElement.dataset.islands='activated'

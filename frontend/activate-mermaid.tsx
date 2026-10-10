import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {MermaidBlock} from './components/MermaidBlock'
let islandIndex=0
for(const element of document.querySelectorAll('[data-island="mermaid"]')){const props=JSON.parse(element.getAttribute('data-island-props')!);hydrateRoot(element,<MermaidBlock {...props}/>,{identifierPrefix:'mermaid-island-'+(islandIndex++)+'-',onRecoverableError:error=>console.error('Mermaid hydration error',error)});element.setAttribute('data-island-active','true')}

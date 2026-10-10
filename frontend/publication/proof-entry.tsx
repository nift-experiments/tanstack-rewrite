import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {ProofShell} from './proof-shell'
const shell=document.querySelector('#shell')!,initialHtml=shell.querySelector('[data-published-region]')!.innerHTML
hydrateRoot(shell,<ProofShell initialHtml={initialHtml}/>,{onRecoverableError:error=>console.error('Publication boundary hydration error',error)})

import React from 'react'
import {renderToString} from 'react-dom/server'
import {ProofShell} from '../frontend/publication/proof-shell'
export const renderProofShell=(html:string)=>renderToString(<ProofShell initialHtml={html}/>)
